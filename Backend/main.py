from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from db import conexion

from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

app = FastAPI()

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gestion-clientes-e16bd.web.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📦 MODELO
class Compra(BaseModel):
    uid: str
    titulo_videojuego: str
    precio: float
    metodo_pago: str

# 🏠 ROOT
@app.get("/")
def home():
    return {"mensaje": "API funcionando 🚀"}

# 💾 ENDPOINT
@app.post("/compras")
def crear_compra(compra: Compra):

    try:
        conn = conexion()
        cursor = conn.cursor()

        # 💾 Insertar directamente (ya no usamos tabla usuarios aquí)
        cursor.execute("""
            INSERT INTO compras (uid, titulo_videojuego, precio, metodo_pago, fecha)
            VALUES (%s, %s, %s, %s, NOW())
        """, (
            compra.uid,
            compra.titulo_videojuego,
            compra.precio,
            compra.metodo_pago
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"mensaje": "Compra registrada correctamente"}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# 🚀 INICIAR SERVIDOR
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)