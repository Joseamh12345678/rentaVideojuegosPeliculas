from pydantic import BaseModel

class Compra(BaseModel):
    uid: str
    titulo_videojuego: str
    precio: float
    metodo_pago: str