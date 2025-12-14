import pandas as pd
import numpy as np
from pymongo import MongoClient
from bson.decimal128 import Decimal128
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os
import sys

# --------------------------------------------------------
# 1. КОНСТАНТИ
# --------------------------------------------------------


MONGO_URI = "mongodb+srv://kristijanjovik_db_user:Z7ElsP3JsscmHMrj@cluster0.pkcuhbd.mongodb.net/"
DATABASE_NAME = "crypto_db"
COLLECTION_NAME = "historical_data"
MODEL_SAVE_PATH = 'model_weights.h5'

# Хиперпараметри за моделот
LOOKBACK_PERIOD = 30  # Влезни денови за предвидување на следниот ден
CLOSE_PRICE_INDEX = 3  # Индекс на 'close' во листата features ['open', 'high', 'low', 'close', 'Volume']
TARGET_SYMBOL_ID = "bitcoin"  # Дефолтен симбол за првично тренирање


# --------------------------------------------------------
# 2. ПОМОШНИ ФУНКЦИИ (Data Handling)
# --------------------------------------------------------

def load_data_from_mongo(target_symbol_id):
    """
    Вчитува историски OHLCV податоци од MongoDB.
    """
    print(f"Почнувам вчитување на податоци за {target_symbol_id}...")

    try:
        # Поврзување со MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Вчитување на податоци
        cursor = collection.find(
            {"symbolId": target_symbol_id},
            {"_id": 0, "timestamp": 1, "open": 1, "high": 1, "low": 1, "close": 1, "totalVolume": 1}
        ).sort("timestamp", 1)

        df = pd.DataFrame(list(cursor))

        # Затворање на конекцијата
        client.close()

        if df.empty:
            print(f"ГРЕШКА: Нема пронајдено податоци за {target_symbol_id}.")
            return None

        # Конверзија на Decimal128 во float
        numeric_cols = ['open', 'high', 'low', 'close', 'totalVolume']
        for col in numeric_cols:
            df[col] = df[col].apply(lambda x: float(str(x.to_decimal())) if isinstance(x, Decimal128) else x)

        # Подготовка на DataFrame
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df.set_index('timestamp', inplace=True)
        df.rename(columns={'totalVolume': 'Volume'}, inplace=True)

        print(f"Успешно вчитани {len(df)} редови.")
        return df

    except Exception as e:
        print(f"Настана грешка при поврзување со MongoDB или вчитување: {e}")
        return None


def create_sequences(data, lookback, close_price_index):
    """
    Креира секвенци (X) и таргети (Y) за тренирање на LSTM.
    """
    X, Y = [], []
    for i in range(lookback, len(data)):
        # X: Влезните податоци за LOOKBACK_PERIOD
        X.append(data[i - lookback:i, :])
        # Y: Цената на следниот ден (затворена цена)
        Y.append(data[i, close_price_index])
    return np.array(X), np.array(Y)


# --------------------------------------------------------
# 3. ТРЕНИРАЊЕ И ЗАЧУВУВАЊЕ НА МОДЕЛОТ
# --------------------------------------------------------

def train_and_save_model(symbol_id: str, model_save_path: str, lookback_period: int, close_price_index: int):
    """
    Ја извршува целата логика за тренирање на моделот, го зачувува и го враќа.
    """
    print(f"\n🧠 Почнувам тренирање на модел за {symbol_id}...")

    # 1. Вчитување податоци
    data = load_data_from_mongo(symbol_id)
    if data is None or data.shape[0] < lookback_period + 1:
        print("ГРЕШКА: Недоволно податоци за тренирање.")
        return None

    # 2. Нормализација
    features = ['open', 'high', 'low', 'close', 'Volume']
    data_to_scale = data[features].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data_to_scale)

    # 3. Креирање секвенци и поделба (70% Train)
    X, Y = create_sequences(scaled_data, lookback_period, close_price_index)
    TRAIN_SIZE = int(len(X) * 0.7)
    X_train, y_train = X[:TRAIN_SIZE], Y[:TRAIN_SIZE]
    X_test, y_test = X[TRAIN_SIZE:], Y[TRAIN_SIZE:]

    # 4. Градење и тренирање на LSTM моделот
    n_features = X_train.shape[2]

    # Keras Sequential API
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(lookback_period, n_features)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mse')

    model.fit(
        X_train,
        y_train,
        epochs=25,
        batch_size=32,
        validation_data=(X_test, y_test),
        verbose=0  # Тренирањето работи во позадина за да не го оптоварува FastAPI
    )
    print("✅ Тренирањето заврши. Зачувувам модел...")

    # 5. Зачувај го моделот
    try:
        model.save(model_save_path)
        print(f"✅ LSTM Моделот е успешно зачуван во: {model_save_path}")
        return model
    except Exception as e:
        print(f"ГРЕШКА при зачувување на моделот: {e}")
        return model


# --------------------------------------------------------
# 4. ГЛОБАЛНО ВЧИТУВАЊЕ НА МОДЕЛОТ (СЕ ИЗВРШУВА ПРИ СТАРТУВАЊЕ)
# --------------------------------------------------------
GLOBAL_MODEL = None

if not os.path.exists(MODEL_SAVE_PATH):
    print(f"⚠️ Моделот '{MODEL_SAVE_PATH}' не постои. Почнувам првично тренирање...")
    # Ако моделот не постои, тренирај го за дефолтниот симбол
    GLOBAL_MODEL = train_and_save_model(
        TARGET_SYMBOL_ID,
        MODEL_SAVE_PATH,
        LOOKBACK_PERIOD,
        CLOSE_PRICE_INDEX
    )
else:
    try:
        # Обиди се да вчиташ постоечки модел
        GLOBAL_MODEL = load_model(MODEL_SAVE_PATH,custom_objects={'mse': 'mse'})
        print("✅ LSTM Моделот е успешно вчитан.")
    except Exception as e:
        print(f"❗ ФАТАЛНА ГРЕШКА: Не можам да го вчитам моделот. Грешка: {e}")
        # Ако вчитувањето пропадне, моделот останува None.

if GLOBAL_MODEL is None:
    print("❌ Сервисот нема да може да предвидува бидејќи моделот не е достапен.")


# --------------------------------------------------------
# 5. ГЛАВНА ФУНКЦИЈА ЗА ПРЕДВИДУВАЊЕ (Повикана од main.py)
# --------------------------------------------------------

def predict_for_symbol(symbol_id: str) -> dict:
    """
    Генерира предвидување за следниот ден за даден симбол ID.
    """
    if GLOBAL_MODEL is None:
        return {"error": "Model not loaded. Check training logs."}

    # 1. Вчитување податоци
    data = load_data_from_mongo(symbol_id)
    if data is None or data.empty or data.shape[0] < LOOKBACK_PERIOD:
        return {"error": f"Data not found or insufficient data ({data.shape[0]} rows) for symbol: {symbol_id}"}

    # 2. Нормализација (MinMaxScaler треба да се тренира на новите податоци)
    features = ['open', 'high', 'low', 'close', 'Volume']
    data_to_scale = data[features].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data_to_scale)

    # 3. Креирање на последната секвенца (last_30_days)
    last_30_days = scaled_data[-LOOKBACK_PERIOD:]
    n_features = scaled_data.shape[1]
    last_30_days_reshaped = np.reshape(last_30_days, (1, LOOKBACK_PERIOD, n_features))

    # 4. Предвидување
    next_day_prediction_scaled = GLOBAL_MODEL.predict(last_30_days_reshaped, verbose=0)

    # 5. Де-нормализација
    # Креираме "лажна" матрица за да го користиме инверзниот трансформ
    predicted_price_full = np.zeros(shape=(1, n_features))
    predicted_price_full[0, CLOSE_PRICE_INDEX] = next_day_prediction_scaled[0, 0]
    next_day_price = scaler.inverse_transform(predicted_price_full)[0, CLOSE_PRICE_INDEX]

    # 6. Враќање на резултатот
    return {
        "symbol": symbol_id,
        "prediction": round(float(next_day_price), 4),
        "last_price": round(float(data['close'].iloc[-1]), 4)
    }