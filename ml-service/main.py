from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Servicio de Predicción de Fallas")

modelo = joblib.load("modelo_prediccion_fallas.pkl")

COMPONENTES_VALIDOS = ["amortiguadores", "bateria", "correa_distribucion", "filtro_aceite", "pastillas_freno"]

class SolicitudPrediccion(BaseModel):
    componente: str
    vida_util_km: int
    km_desde_instalacion: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predecir")
def predecir(solicitud: SolicitudPrediccion):
    pct_vida_util = solicitud.km_desde_instalacion / solicitud.vida_util_km

    fila = {"vida_util_km": solicitud.vida_util_km, "pct_vida_util": pct_vida_util}
    for comp in COMPONENTES_VALIDOS:
        fila[f"comp_{comp}"] = (comp == solicitud.componente)

    X_nuevo = pd.DataFrame([fila])

    probabilidad = modelo.predict_proba(X_nuevo)[0][1]  # probabilidad de la clase "1" (fallo)

    return {
        "componente": solicitud.componente,
        "pct_vida_util": round(pct_vida_util, 4),
        "score_riesgo": round(float(probabilidad), 4),
        "recomendacion": _generar_recomendacion(probabilidad),
    }

def _generar_recomendacion(probabilidad: float) -> str:
    if probabilidad >= 0.7:
        return "Riesgo alto — se recomienda revisión inmediata"
    elif probabilidad >= 0.4:
        return "Riesgo moderado — programar revisión próximamente"
    return "Riesgo bajo — sin acción requerida"