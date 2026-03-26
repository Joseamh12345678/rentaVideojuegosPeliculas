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
    allow_origins=["*"],
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

        # 🔍 Buscar usuario por UID
        cursor.execute(
            "SELECT id_usuario FROM usuarios WHERE uid_firebase = %s",
            (compra.uid,)
        )
        row = cursor.fetchone()

        # 👤 Si no existe, crearlo
        if row:
            id_usuario = row[0]
        else:
            cursor.execute("""
                INSERT INTO usuarios (uid_firebase, correo, fecha_registro)
                VALUES (%s, %s, NOW())
                RETURNING id_usuario
            """, (compra.uid, "sin_correo"))

            id_usuario = cursor.fetchone()[0]
            conn.commit()

        # 💾 Insertar compra
        cursor.execute("""
            INSERT INTO compras (id_usuario, titulo_videojuego, precio, metodo_pago, fecha_compra)
            VALUES (%s, %s, %s, %s, NOW())
        """, (
            id_usuario,
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
        print(traceback.format_exc())  # 🔥 para logs en Railway
        raise HTTPException(status_code=500, detail=str(e))

# 🚀 INICIAR SERVIDOR
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)