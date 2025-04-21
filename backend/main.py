from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Data Models
# -----------------------------

class Game(BaseModel):
    equipoA: str
    equipoB: str
    probA: float
    probB: float
    spread: str
    total: str

class RecomendacionInput(BaseModel):
    tipo: str  # moneyline, spread, total, arriesgada
    juegos: List[Game]
    min_probabilidad: float = 0.0  # Nueva opción para filtrar por mínimo
    top_n: int = 3  # Cuántas recomendaciones devolver


# -----------------------------
# Lógica IA avanzada
# -----------------------------

def calcular_puntaje(juego: Game, tipo: str) -> float:
    if tipo == "moneyline":
        return max(juego.probA, juego.probB)
    elif tipo == "spread":
        return abs(juego.probA - juego.probB)
    elif tipo == "total":
        return -abs(float(juego.total) - 45)  # más cerca a 45, mejor
    elif tipo == "arriesgada":
        return min(juego.probA, juego.probB)
    else:
        return 0.0

def generar_explicacion(juego: Game, tipo: str) -> str:
    if tipo == "moneyline":
        ganador = juego.equipoA if juego.probA > juego.probB else juego.equipoB
        return f"{ganador} tiene la mayor probabilidad de victoria: {max(juego.probA, juego.probB)*100:.1f}%"
    elif tipo == "spread":
        return f"Diferencia de probabilidades alta: {abs(juego.probA - juego.probB)*100:.1f}%"
    elif tipo == "total":
        return f"Total de puntos cercano al promedio: {juego.total}"
    elif tipo == "arriesgada":
        underdog = juego.equipoA if juego.probA < juego.probB else juego.equipoB
        return f"{underdog} podría sorprender con {min(juego.probA, juego.probB)*100:.1f}% de probabilidad"
    return "Sin explicación disponible"


# -----------------------------
# Endpoint Principal
# -----------------------------

@app.post("/recomendar")
def recomendar_apuestas(data: RecomendacionInput):
    tipo = data.tipo.lower()
    juegos = [j for j in data.juegos if max(j.probA, j.probB) >= data.min_probabilidad]

    if not juegos:
        raise HTTPException(status_code=400, detail="No hay juegos que cumplan con los criterios.")

    juegos_con_puntaje = [
        {
            "juego": j,
            "puntaje": calcular_puntaje(j, tipo),
            "explicacion": generar_explicacion(j, tipo)
        }
        for j in juegos
    ]

    recomendaciones = sorted(juegos_con_puntaje, key=lambda x: x["puntaje"], reverse=True)[:data.top_n]

    return {
        "tipo": tipo,
        "recomendaciones": recomendaciones
    }
