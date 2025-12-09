from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd

from technical_indicators import analyze_timeframes


app = FastAPI(title="Crypto Technical Analysis API")


class Candle(BaseModel):
    timestamp: str  # ISO формат: "2024-01-01T00:00:00" или "2024-01-01"
    open: float
    high: float
    low: float
    close: float
    volume: float


class AnalyzeRequest(BaseModel):
    candles: List[Candle]


# Тест класа за да се осигураме дека API работи
@app.get("/")
def read_root():
    return {"message": "Technical analysis API is running"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    # Претвораме во DataFrame
    df = pd.DataFrame([candle.dict() for candle in request.candles])

    # Го користиме веќе готовиот код
    results = analyze_timeframes(df)

    return {
        "timeframes": results
    }
