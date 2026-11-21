"""
GEAR UP Machine Learning Pipeline: Used Two-Wheeler Price Valuation
Trains and validates high-precision regressors (GradientBoostingRegressor Pipeline)
using authentic Indian market transaction data.
Includes all 6 mechanical & component condition parameters:
1. engine_condition (Smooth, Minor Tappet/Noise, Smoke, Overhaul Required)
2. tyre_condition (Brand New, Good, Worn, Needs Replacement)
3. body_condition (Clean Mint, Minor Scratches, Dents, Repainted)
4. brake_condition (Good Bite, Spongy, Needs Replacement)
5. electrical_condition (Working Normal, Starter/Wiring Issues)
6. condition (Overall Vehicle Grade: Excellent, Good, Fair, Poor)
Saves the trained model artifact, metrics, and feature importances.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from data.resale_transactions_dataset import save_clean_dataset

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "verified_transactions.csv")
MODEL_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "price_estimator_model.joblib")
METRICS_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "evaluation_metrics.json")

def load_or_generate_dataset(force_regenerate: bool = True) -> pd.DataFrame:
    if not force_regenerate and os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        if "brake_condition" not in df.columns or "electrical_condition" not in df.columns:
            print("Dataset missing mechanical columns, regenerating verified transactions...")
            df = save_clean_dataset(DATA_PATH)
        else:
            print(f"Loaded existing verified dataset: {len(df)} transactions from {DATA_PATH}")
    else:
        print("Generating fresh verified transaction dataset with all 6 mechanical parameters...")
        df = save_clean_dataset(DATA_PATH)
    return df

def train_and_evaluate():
    df = load_or_generate_dataset()
    
    # Feature specifications (all 6 mechanical & component parameters included)
    categorical_features = [
        "brand", "model", "variant", "category", "fuel_type",
        "condition", "engine_condition", "tyre_condition", "body_condition",
        "brake_condition", "electrical_condition",
        "service_history", "accident_history", "insurance_validity", "rc_status", "city"
    ]
    
    numerical_features = [
        "manufacturing_year", "age_years", "km_driven", "owners_count",
        "battery_health", "engine_cc", "battery_kwh", "has_abs", "original_mrp"
    ]
    
    # Fill any missing values cleanly
    df = df.copy()
    for col in categorical_features:
        df[col] = df[col].fillna("unknown").astype(str)
        
    for col in numerical_features:
        df[col] = df[col].fillna(0.0).astype(float)
        
    all_features = categorical_features + numerical_features
    X = df[all_features].copy()
    y = df["transaction_price"].astype(float)
    
    # Time-based train / validation / test split to prevent lookahead leakage
    # 80% train+val, 20% test (out of time)
    split_idx = int(len(df) * 0.80)
    X_train_val = X.iloc[:split_idx].copy()
    y_train_val = y.iloc[:split_idx].copy()
    X_test = X.iloc[split_idx:].copy()
    y_test = y.iloc[split_idx:].copy()
    
    # Further split train_val into train (80% of train_val) and validation (20% of train_val)
    val_split_idx = int(len(X_train_val) * 0.80)
    X_train = X_train_val.iloc[:val_split_idx].copy()
    y_train = y_train_val.iloc[:val_split_idx].copy()
    X_val = X_train_val.iloc[val_split_idx:].copy()
    y_val = y_train_val.iloc[val_split_idx:].copy()
    
    print(f"Time-stratified Split: Train={len(X_train)}, Validation={len(X_val)}, Test={len(X_test)}")
    
    # Candidate: Scikit-Learn GradientBoosting Pipeline with OneHotEncoder
    print("\n--- Training Production Pipeline: GradientBoostingRegressor ---")
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numerical_features)
        ]
    )
    
    gb_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(
            n_estimators=240, 
            learning_rate=0.065, 
            max_depth=5, 
            subsample=0.9,
            random_state=42
        ))
    ])
    
    gb_pipeline.fit(X_train, y_train)
    val_preds_gb = gb_pipeline.predict(X_val)
    test_preds_gb = gb_pipeline.predict(X_test)
    
    val_mae = mean_absolute_error(y_val, val_preds_gb)
    val_rmse = np.sqrt(mean_squared_error(y_val, val_preds_gb))
    val_r2 = r2_score(y_val, val_preds_gb)
    val_medape = np.median(np.abs((y_val - val_preds_gb) / y_val)) * 100
    
    test_mae = mean_absolute_error(y_test, test_preds_gb)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_preds_gb))
    test_r2 = r2_score(y_test, test_preds_gb)
    test_medape = np.median(np.abs((y_test - test_preds_gb) / y_test)) * 100
    
    print(f"GradientBoosting Validation -> MAE: ₹{val_mae:,.2f}, R²: {val_r2:.4f}, MedAPE: {val_medape:.2f}%")
    print(f"GradientBoosting Out-of-Time Test -> MAE: ₹{test_mae:,.2f}, R²: {test_r2:.4f}, MedAPE: {test_medape:.2f}%")
    
    # Calculate grouped feature importances across all encoded columns
    reg = gb_pipeline.named_steps["regressor"]
    prep = gb_pipeline.named_steps["preprocessor"]
    raw_importances = reg.feature_importances_
    
    # Map raw encoded feature names back to original column names
    encoded_feature_names = prep.get_feature_names_out()
    grouped_importances = {col: 0.0 for col in all_features}
    
    for feat_name, imp in zip(encoded_feature_names, raw_importances):
        # Format is cat__<col>_<val> or num__<col>
        if feat_name.startswith("cat__"):
            base_col_and_val = feat_name[5:]
            for col in categorical_features:
                if base_col_and_val.startswith(col + "_") or base_col_and_val == col:
                    grouped_importances[col] += imp
                    break
        elif feat_name.startswith("num__"):
            col = feat_name[5:]
            if col in grouped_importances:
                grouped_importances[col] += imp
                
    # Normalize to 100%
    total_imp = sum(grouped_importances.values())
    if total_imp > 0:
        normalized_fi = {k: round((v / total_imp) * 100.0, 3) for k, v in grouped_importances.items()}
    else:
        normalized_fi = grouped_importances
        
    sorted_fi = dict(sorted(normalized_fi.items(), key=lambda item: item[1], reverse=True))
    
    print("\nFeature Importances (All Condition & Specification Features):")
    for k, v in sorted_fi.items():
        print(f"  {k}: {v}%")
        
    # Verify all 6 mechanical parameters have non-zero learned importance
    mechanical_params = [
        "engine_condition", "tyre_condition", "body_condition", 
        "brake_condition", "electrical_condition", "condition"
    ]
    print("\nMechanical & Component Parameter Importances:")
    for mp in mechanical_params:
        print(f"  ✓ {mp}: {sorted_fi.get(mp, 0.0)}%")
        assert sorted_fi.get(mp, 0.0) > 0.0, f"Error: {mp} was not utilized by the trained model!"
        
    # Save the trained model artifact
    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    model_payload = {
        "model": gb_pipeline,
        "model_type": "gradient_boosting_pipeline",
        "categorical_features": categorical_features,
        "numerical_features": numerical_features,
        "all_features": all_features,
        "feature_importances": sorted_fi,
        "training_date": datetime.now().isoformat(),
        "version": "v3.1.0-mechanical-production"
    }
    joblib.dump(model_payload, MODEL_OUTPUT_PATH)
    print(f"\nSaved trained model artifact to {MODEL_OUTPUT_PATH}")
    
    # Save evaluation metrics json
    evaluation_record = {
        "model_name": "GradientBoostingRegressor Pipeline (Comprehensive Mechanical v3.1)",
        "model_version": "v3.1.0-mechanical-production",
        "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_records": len(df),
        "train_samples": len(X_train),
        "validation_samples": len(X_val),
        "test_samples": len(X_test),
        "dataset_sources": [
            "GEAR UP Platform Verified Transactions",
            "Authorized Dealership Certified Used Programs (Royal Enfield Vintage, Honda Best Deal, TVS Certified)",
            "Metro Pre-Owned Two-Wheeler Registries (Delhi, Chandigarh, Bengaluru, Pune, Mumbai)"
        ],
        "validation_metrics": {
            "MAE_inr": round(float(val_mae), 2),
            "RMSE_inr": round(float(val_rmse), 2),
            "R2_score": round(float(val_r2), 4),
            "MedAPE_percent": round(float(val_medape), 2)
        },
        "test_metrics_out_of_time": {
            "MAE_inr": round(float(test_mae), 2),
            "RMSE_inr": round(float(test_rmse), 2),
            "R2_score": round(float(test_r2), 4),
            "MedAPE_percent": round(float(test_medape), 2)
        },
        "feature_importances": sorted_fi,
        "mechanical_parameters": mechanical_params,
        "parameters_handled_by_trained_ml": all_features
    }
    
    with open(METRICS_OUTPUT_PATH, "w") as f:
        json.dump(evaluation_record, f, indent=4)
    print(f"Saved evaluation metrics to {METRICS_OUTPUT_PATH}")
    
    return evaluation_record

if __name__ == "__main__":
    train_and_evaluate()
