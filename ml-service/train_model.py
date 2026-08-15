"""
Script de entrenamiento del modelo de predicción de fallas.
Genera un dataset sintético, entrena un RandomForestClassifier,
y guarda el modelo entrenado en modelo_prediccion_fallas.pkl
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

np.random.seed(42)

# --- 1. Catálogo de componentes ---
componentes = pd.DataFrame({
    "componente": ["bateria", "correa_distribucion", "pastillas_freno", "amortiguadores", "filtro_aceite"],
    "vida_util_km": [60000, 90000, 30000, 80000, 10000],
    "vida_util_meses": [36, 60, 24, 48, 12],
})

# --- 2. Generación del dataset sintético ---
N = 2000

idx_componente = np.random.randint(0, len(componentes), N)
comp_asignado = componentes.iloc[idx_componente].reset_index(drop=True)

km_desde_instalacion = np.random.uniform(0, comp_asignado["vida_util_km"] * 1.3)

dataset = pd.DataFrame({
    "componente": comp_asignado["componente"],
    "vida_util_km": comp_asignado["vida_util_km"],
    "km_desde_instalacion": km_desde_instalacion.round(0),
})
dataset["pct_vida_util"] = dataset["km_desde_instalacion"] / dataset["vida_util_km"]

# --- 3. Variable objetivo (target) ---
prob_falla = 1 / (1 + np.exp(-6 * (dataset["pct_vida_util"] - 1)))
dataset["fallo"] = (np.random.uniform(0, 1, len(dataset)) < prob_falla).astype(int)

# --- 4. Encoding de la columna categórica ---
dataset_encoded = pd.get_dummies(dataset, columns=["componente"], prefix="comp")

# --- 5. Separar features (X) y target (y) ---
X = dataset_encoded.drop(columns=["fallo", "km_desde_instalacion"])
y = dataset_encoded["fallo"]

# --- 6. Train/test split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# --- 7. Entrenamiento ---
modelo = RandomForestClassifier(n_estimators=100, random_state=42)
modelo.fit(X_train, y_train)

# --- 8. Evaluación ---
y_pred = modelo.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print()
print(classification_report(y_test, y_pred, target_names=["No falla", "Falla"]))

importancias = pd.DataFrame({
    "feature": X.columns,
    "importancia": modelo.feature_importances_
}).sort_values("importancia", ascending=False)
print("Importancia de features:")
print(importancias)

# --- 9. Guardar el modelo entrenado ---
joblib.dump(modelo, "modelo_prediccion_fallas.pkl")
print("\nModelo guardado en modelo_prediccion_fallas.pkl")