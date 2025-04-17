from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware      # ⬅️  nuevo
from pydantic import BaseModel
from typing import List

app = FastAPI()

# --- 🔑  Permitir llamadas desde tu Vite dev‑server ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------  Modelo ----------
class Game(BaseModel):
    equipoA: str
    equipoB: str
    probA: float
    probB: float

# ----------  Endpoint ----------
@app.post("/mejor-apuesta")
def apuesta_mas_segura(juegos: List[Game]):
    if not juegos:
        raise HTTPException(status_code=400, detail="Lista de juegos vacía")

    mejor = max(juegos, key=lambda j: max(j.probA, j.probB))
    ganador = mejor.equipoA if mejor.probA > mejor.probB else mejor.equipoB
    prob = max(mejor.probA, mejor.probB)

    return {
        "equipo_ganador": ganador,
        "probabilidad": prob,
        "juego": mejor
    }
