# backend/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/ping")
def read_root():
    return {"message": "pong"}
