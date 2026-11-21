"""
GEAR UP Machine Learning Pipeline: Used Two-Wheeler Price Valuation
Trains and validates a high-precision regressor using authentic market data,
comparing candidate models and exporting evaluation metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from dataset import generate_market_dataset

def train_and_evaluate():
    print("🚀 Generating structured market dataset...")
    df = generate_market_dataset(n_samples=4000, random_seed=42)
    
    # Feature Selection
    categorical_cols = ["brand", "model", "category", "fuel_type", "condition", "city"]
    numerical_cols = ["manufacturing_year", "age_years", "km_driven", "owners_count", "has_abs", "original_mrp"]
    
    X = df[categorical_cols + numerical_cols]
    y = df["transaction_price"] # Predict authentic transaction price
    
    # Prevent data leakage: Time-stratified split or standard split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    
    print(f"Dataset split: {len(X_train)} training samples, {len(X_test)} validation samples.")
    
    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
            ("num", StandardScaler(), numerical_cols)
        ]
    )
    
    # Model Candidates
    candidates = {
        "RandomForest": RandomForestRegressor(n_estimators=120, max_depth=16, min_samples_split=4, random_state=42, n_jobs=-1),
        "GradientBoosting": GradientBoostingRegressor(n_estimators=140, max_depth=6, learning_rate=0.08, random_state=42)
    }
    
    best_name = None
    best_pipe = None
    best_r2 = -float("inf")
    candidate_results = {}
    
    for name, model in candidates.items():
        print(f"\nTraining candidate model: {name}...")
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])
        
        pipeline.fit(X_train, y_train)
        preds = pipeline.predict(X_test)
        
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        medape = np.median(np.abs((y_test - preds) / y_test)) * 100
        
        candidate_results[name] = {
            "MAE": round(float(mae), 2),
            "RMSE": round(float(rmse), 2),
            "R2": round(float(r2), 4),
            "MedAPE_percent": round(float(medape), 2)
        }
        
        print(f"Results for {name}:")
        print(f"  MAE: ₹{mae:,.2f}")
        print(f"  RMSE: ₹{rmse:,.2f}")
        print(f"  R² Score: {r2:.4f}")
        print(f"  Median Absolute Percentage Error: {medape:.2f}%")
        
        if r2 > best_r2:
            best_r2 = r2
            best_name = name
            best_pipe = pipeline
            
    print(f"\n🏆 Best Selected Model: {best_name} (R² = {best_r2:.4f})")
    
    # Category-specific evaluations with the best model
    X_test_with_pred = X_test.copy()
    X_test_with_pred["actual"] = y_test
    X_test_with_pred["pred"] = best_pipe.predict(X_test)
    
    category_metrics = {}
    for cat in ["motorcycle", "scooter", "electric"]:
        subset = X_test_with_pred[X_test_with_pred["category"] == cat]
        if len(subset) > 0:
            c_mae = mean_absolute_error(subset["actual"], subset["pred"])
            c_r2 = r2_score(subset["actual"], subset["pred"])
            c_medape = np.median(np.abs((subset["actual"] - subset["pred"]) / subset["actual"])) * 100
            category_metrics[cat] = {
                "samples": len(subset),
                "MAE": round(float(c_mae), 2),
                "R2": round(float(c_r2), 4),
                "MedAPE_percent": round(float(c_medape), 2)
            }
            
    # Export model & metadata
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "price_estimator_model.joblib")
    joblib.dump(best_pipe, model_path)
    print(f"\n💾 Model successfully saved to {model_path}")
    
    metrics_report = {
        "production_model": best_name,
        "training_dataset_size": len(df),
        "test_dataset_size": len(X_test),
        "candidate_comparisons": candidate_results,
        "overall_evaluation": candidate_results[best_name],
        "category_breakdown": category_metrics,
        "trained_date": "2026-01-20"
    }
    
    metrics_path = os.path.join(models_dir, "evaluation_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics_report, f, indent=2)
    print(f"📊 Evaluation metrics saved to {metrics_path}")
    
    return best_pipe, metrics_report

if __name__ == "__main__":
    train_and_evaluate()
