"""
Document Type Classification Model Training Script
Trains and validates a supervised text classifier to identify:
- RC (Registration Certificate)
- INSURANCE (Vehicle Insurance Policy)
- PUC (Pollution Under Control Certificate)
- OTHER (Non-vehicle document)
- UNREADABLE (Corrupted / low quality text)

Compares Logistic Regression, Linear SVM, and Random Forest.
Evaluates final model on held-out independent test set.
Generates full classification report, confusion matrix, and metadata.
"""

import os
import json
from datetime import datetime
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

def load_split(filename: str):
    path = os.path.join(DATASETS_DIR, filename)
    with open(path, "r") as f:
        data = json.load(f)
    texts = [d["raw_text"] for d in data]
    labels = [d["class"] for d in data]
    return texts, labels

def train_and_evaluate():
    print("=" * 70)
    print("TRAINING DOCUMENT TYPE CLASSIFIER (MODEL A)")
    print("=" * 70)
    
    # 1. Load data
    train_texts, train_labels = load_split("train/train_samples.json")
    val_texts, val_labels = load_split("validation/val_samples.json")
    test_texts, test_labels = load_split("test/test_samples.json")
    
    print(f"Loaded: Train={len(train_texts)}, Val={len(val_texts)}, Test={len(test_texts)}")
    
    # 2. Fit TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        sublinear_tf=True,
        stop_words="english"
    )
    X_train = vectorizer.fit_transform(train_texts)
    X_val = vectorizer.transform(val_texts)
    X_test = vectorizer.transform(test_texts)
    
    # 3. Candidate Models
    candidates = {
        "LogisticRegression": LogisticRegression(C=1.0, max_iter=1000, random_state=42),
        "LinearSVC": LinearSVC(C=1.0, max_iter=2000, random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    }
    
    best_name = None
    best_model = None
    best_val_f1 = -1.0
    val_results = {}
    
    for name, clf in candidates.items():
        clf.fit(X_train, train_labels)
        preds = clf.predict(X_val)
        acc = accuracy_score(val_labels, preds)
        _, _, macro_f1, _ = precision_recall_fscore_support(val_labels, preds, average="macro")
        val_results[name] = {"accuracy": round(acc, 4), "macro_f1": round(macro_f1, 4)}
        print(f"Candidate [{name}]: Val Accuracy = {acc:.4f}, Val Macro F1 = {macro_f1:.4f}")
        
        if macro_f1 > best_val_f1:
            best_val_f1 = macro_f1
            best_name = name
            best_model = clf
            
    print(f"\n✓ Best Candidate on Validation Split: {best_name} (Macro F1: {best_val_f1:.4f})")
    
    # 4. Final Evaluation on Independent Test Set
    test_preds = best_model.predict(X_test)
    test_acc = accuracy_score(test_labels, test_preds)
    test_precision, test_recall, test_f1, _ = precision_recall_fscore_support(test_labels, test_preds, average="macro")
    
    classes = sorted(list(set(test_labels)))
    per_class_p, per_class_r, per_class_f1, per_class_support = precision_recall_fscore_support(
        test_labels, test_preds, labels=classes
    )
    
    cm = confusion_matrix(test_labels, test_preds, labels=classes).tolist()
    clf_report = classification_report(test_labels, test_preds, digits=4, output_dict=True)
    
    print("\n" + "=" * 70)
    print("INDEPENDENT TEST SET EVALUATION REPORT (MODEL A)")
    print("=" * 70)
    print(f"Overall Accuracy:  {test_acc:.4f} ({test_acc * 100:.2f}%)")
    print(f"Macro Precision:   {test_precision:.4f}")
    print(f"Macro Recall:      {test_recall:.4f}")
    print(f"Macro F1 Score:    {test_f1:.4f}")
    print("-" * 70)
    print(f"{'CLASS':<15} | {'PRECISION':<10} | {'RECALL':<10} | {'F1-SCORE':<10} | {'SUPPORT':<8}")
    print("-" * 70)
    for i, c in enumerate(classes):
        print(f"{c:<15} | {per_class_p[i]:<10.4f} | {per_class_r[i]:<10.4f} | {per_class_f1[i]:<10.4f} | {per_class_support[i]:<8}")
    print("-" * 70)
    
    # 5. Save Models and Metadata
    model_path = os.path.join(MODELS_DIR, "document_classifier_model.joblib")
    vec_path = os.path.join(MODELS_DIR, "tfidf_vectorizer.joblib")
    joblib.dump(best_model, model_path)
    joblib.dump(vectorizer, vec_path)
    
    model_metadata = {
        "model_name": "GEAR_UP_Document_Type_Classifier",
        "model_architecture": best_name,
        "model_version": "v1.2.0-rc-verified",
        "training_date": datetime.now().isoformat(),
        "classes": classes,
        "dataset_info": {
            "source": "De-identified Synthetic Indian Transport Documents (Parivahan, Form 23, Insurance, PUCC)",
            "total_samples": len(train_texts) + len(val_texts) + len(test_texts),
            "train_samples": len(train_texts),
            "val_samples": len(val_texts),
            "test_samples": len(test_texts),
            "split_strategy": "Stratified 70/15/15 by document class without identity leakage"
        },
        "evaluation_metrics": {
            "test_accuracy": round(float(test_acc), 4),
            "test_macro_precision": round(float(test_precision), 4),
            "test_macro_recall": round(float(test_recall), 4),
            "test_macro_f1": round(float(test_f1), 4),
            "confusion_matrix": cm,
            "per_class": {
                c: {
                    "precision": round(float(per_class_p[i]), 4),
                    "recall": round(float(per_class_r[i]), 4),
                    "f1_score": round(float(per_class_f1[i]), 4),
                    "support": int(per_class_support[i])
                }
                for i, c in enumerate(classes)
            }
        },
        "deployment_status": "READY_FOR_LOCAL_INFERENCE"
    }
    
    with open(os.path.join(MODELS_DIR, "ml_metadata.json"), "w") as f:
        json.dump(model_metadata, f, indent=2)
        
    with open(os.path.join(REPORTS_DIR, "classification_report.json"), "w") as f:
        json.dump(clf_report, f, indent=2)
        
    print(f"\n✓ Saved trained model to {model_path}")
    print(f"✓ Saved TF-IDF vectorizer to {vec_path}")
    print(f"✓ Saved metadata and reports to {REPORTS_DIR}")

if __name__ == "__main__":
    train_and_evaluate()
