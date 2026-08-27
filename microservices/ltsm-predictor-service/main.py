from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Ја вчитуваме функцијата од lstm_logic.py
from lstm_logic import predict_for_symbol

# Иницијализирање на FastAPI апликацијата
app = FastAPI(
    title="LSTM Crypto Prediction Service",
    description="Microservice for forecasting cryptocurrency prices using an LSTM model.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "LSTM Service is online"}


# Дефинирање на рутата што Spring Boot ќе ја повикува
# Патека: /api/v1/predict/{symbol_id}
@app.get("/api/v1/predict/{symbol_id}")
def get_prediction(symbol_id: str):
    """
    HTTP GET рута. Го прима симбол ID-то (на пр. 'bitcoin') и враќа предвидена цена.
    """
    print(f"[FASTAPI] Примено барање за предвидување на цената за: {symbol_id}")

    # Повикување на LSTM логиката од lstm_logic.py
    prediction_result = predict_for_symbol(symbol_id)

    # Проверка дали функцијата вратила грешка (на пр. Моделот не е вчитан или нема податоци)
    if "error" in prediction_result:
        error_message = prediction_result["error"]
        print(f"[FASTAPI ERROR] {error_message}")
        # Враќа HTTP 404 (Not Found) со детална порака
        raise HTTPException(status_code=404, detail=error_message)

    print(f"[FASTAPI SUCCESS] Враќам предвидување за {symbol_id}: {prediction_result['prediction']}")
    return prediction_result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8081)