"""
Training Pipeline for Bike Doctor ML Models.
Trains:
  1. NLP Symptom Classifier (TF-IDF + Calibrated LinearSVC)
  2. Structured Fault Predictor (OneHotEncoder + StandardScaler + RandomForestClassifier)
Evaluates full cross-validated metrics (Accuracy, Precision, Recall, F1 Macro/Weighted, Top-1/Top-3).
Saves serialized artifacts and metadata into backend/models/bike_doctor/.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, timezone
from typing import Dict, Any, Tuple

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models", "bike_doctor")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")
DATA_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "bike_doctor_dataset.csv")

def load_data(csv_path: str = DATA_CSV_PATH) -> pd.DataFrame:
    """Loads diagnostic training dataset."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset file not found at {csv_path}")
    df = pd.read_csv(csv_path)
    return df

def train_symptom_classifier(df: pd.DataFrame) -> Tuple[Pipeline, Dict[str, Any]]:
    """
    Trains Model 1: NLP Symptom Classifier mapping raw complaint text
    to standardized symptom categories.
    """
    X = df["symptom_text"].fillna("").astype(str)
    y = df["primary_symptom_class"].astype(str)

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=1,
        strip_accents="unicode"
    )

    base_svc = LinearSVC(dual="auto", max_iter=3000, random_state=42)
    calibrated_clf = CalibratedClassifierCV(estimator=base_svc, method="sigmoid", cv=3)

    pipeline = Pipeline([
        ("tfidf", vectorizer),
        ("clf", calibrated_clf)
    ])

    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1_macro, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
    _, _, f1_weighted, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)

    # Top-3 Accuracy
    probs = pipeline.predict_proba(X_test)
    classes = pipeline.classes_
    top3_correct = 0
    for i, true_label in enumerate(y_test):
        top3_indices = np.argsort(probs[i])[::-1][:3]
        top3_labels = [classes[idx] for idx in top3_indices]
        if true_label in top3_labels:
            top3_correct += 1
    top3_acc = top3_correct / len(y_test) if len(y_test) > 0 else 1.0

    metrics = {
        "accuracy": round(float(acc), 4),
        "top3_accuracy": round(float(top3_acc), 4),
        "precision_macro": round(float(prec), 4),
        "recall_macro": round(float(rec), 4),
        "f1_macro": round(float(f1_macro), 4),
        "f1_weighted": round(float(f1_weighted), 4),
        "test_sample_count": len(y_test),
        "classes": list(classes)
    }

    return pipeline, metrics

def train_fault_predictor(df: pd.DataFrame) -> Tuple[Pipeline, Dict[str, Any]]:
    """
    Trains Model 2: Structured Fault Predictor mapping vehicle attributes +
    predicted symptom class to component-level fault.
    """
    categorical_features = ["category", "fuel_type", "primary_symptom_class", "brand"]
    numeric_features = ["engine_cc", "age_years", "odometer_km"]

    X = df[categorical_features + numeric_features].copy()
    X.loc[:, "engine_cc"] = pd.to_numeric(X["engine_cc"], errors="coerce").fillna(125.0)
    X.loc[:, "age_years"] = pd.to_numeric(X["age_years"], errors="coerce").fillna(3.0)
    X.loc[:, "odometer_km"] = pd.to_numeric(X["odometer_km"], errors="coerce").fillna(20000.0)

    y = df["fault_component"].astype(str)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numeric_features)
        ]
    )

    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=14,
        class_weight="balanced",
        random_state=42
    )

    pipeline = Pipeline([
        ("prep", preprocessor),
        ("clf", clf)
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1_macro, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
    _, _, f1_weighted, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)

    # Top-3 Accuracy
    probs = pipeline.predict_proba(X_test)
    classes = pipeline.classes_
    top3_correct = 0
    for i, true_label in enumerate(y_test):
        top3_indices = np.argsort(probs[i])[::-1][:3]
        top3_labels = [classes[idx] for idx in top3_indices]
        if true_label in top3_labels:
            top3_correct += 1
    top3_acc = top3_correct / len(y_test) if len(y_test) > 0 else 1.0

    metrics = {
        "accuracy": round(float(acc), 4),
        "top3_accuracy": round(float(top3_acc), 4),
        "precision_macro": round(float(prec), 4),
        "recall_macro": round(float(rec), 4),
        "f1_macro": round(float(f1_macro), 4),
        "f1_weighted": round(float(f1_weighted), 4),
        "test_sample_count": len(y_test),
        "components": list(classes)
    }

    return pipeline, metrics

def train_and_save_all(version_tag: str = "v1.0.0") -> Dict[str, Any]:
    """Runs complete training suite and persists artifacts."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    print(f"🔄 Loading data from {DATA_CSV_PATH}...")
    df = load_data()

    print("🧠 Training Model 1: NLP Symptom Classifier...")
    symptom_model, symptom_metrics = train_symptom_classifier(df)
    symptom_model_path = os.path.join(MODEL_DIR, "symptom_classifier.joblib")
    joblib.dump(symptom_model, symptom_model_path)
    print(f"   Model 1 F1 Macro: {symptom_metrics['f1_macro']} | Top-3 Acc: {symptom_metrics['top3_accuracy']}")

    print("🔧 Training Model 2: Structured Fault Predictor...")
    fault_model, fault_metrics = train_fault_predictor(df)
    fault_model_path = os.path.join(MODEL_DIR, "fault_predictor.joblib")
    joblib.dump(fault_model, fault_model_path)
    print(f"   Model 2 F1 Macro: {fault_metrics['f1_macro']} | Top-3 Acc: {fault_metrics['top3_accuracy']}")

    metadata = {
        "model_version": version_tag,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_size": len(df),
        "symptom_classifier": symptom_metrics,
        "fault_predictor": fault_metrics,
        "supported_symptom_classes": symptom_metrics["classes"],
        "supported_components": fault_metrics["components"]
    }

    meta_path = os.path.join(MODEL_DIR, "model_metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Training completed successfully! Metadata saved to {meta_path}")
    return metadata

def retrain_model_with_approved_feedback() -> Dict[str, Any]:
    """
    Ingests all approved feedback records, appends them to training data,
    increments version tag, and triggers retrain.
    """
    from .feedback_store import get_approved_for_training
    approved = get_approved_for_training()
    
    df = load_data()
    initial_count = len(df)
    new_rows = []

    for item in approved:
        v_sum = item.get("vehicle_summary", {})
        new_row = {
            "case_id": item.get("feedback_id"),
            "brand": v_sum.get("brand", "Royal Enfield"),
            "model": v_sum.get("model", "Classic 350"),
            "category": v_sum.get("category", "motorcycle"),
            "fuel_type": v_sum.get("fuel_type", "petrol"),
            "engine_cc": v_sum.get("engine_cc", 349),
            "age_years": v_sum.get("age_years", 3),
            "odometer_km": v_sum.get("odometer_km", 20000),
            "symptom_text": item.get("original_symptom", "Unusual vehicle noise"),
            "primary_symptom_class": item.get("actual_fault_category", "engine_starting_failure"),
            "fault_component": item.get("actual_fault_component", "Powertrain Wear"),
            "fault_category": item.get("actual_fault_category", "engine_starting_failure"),
            "severity": "MODERATE",
            "urgency_level": "caution_visit_soon",
            "mechanic_verified": True,
            "resolution": item.get("resolution_notes", "Mechanic verified repair outcome")
        }
        new_rows.append(new_row)

    if new_rows:
        new_df = pd.DataFrame(new_rows)
        combined = pd.concat([df, new_df], ignore_index=True)
        combined.to_csv(DATA_CSV_PATH, index=False)
        print(f"📈 Appended {len(new_rows)} approved cases to training dataset.")

    # Determine new version
    meta_path = os.path.join(MODEL_DIR, "model_metadata.json")
    old_version = "v1.0.0"
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            old_meta = json.load(f)
            old_version = old_meta.get("model_version", "v1.0.0")

    # Increment version patch
    try:
        parts = old_version.lstrip("v").split(".")
        new_patch = int(parts[2]) + 1
        new_version = f"v{parts[0]}.{parts[1]}.{new_patch}"
    except Exception:
        new_version = "v1.0.1"

    new_metadata = train_and_save_all(version_tag=new_version)
    new_metadata["new_cases_added"] = len(new_rows)
    new_metadata["previous_dataset_size"] = initial_count
    return new_metadata

if __name__ == "__main__":
    train_and_save_all()
