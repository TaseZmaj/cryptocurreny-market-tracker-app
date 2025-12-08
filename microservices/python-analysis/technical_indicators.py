import pandas as pd
import numpy as np

from ta.momentum import RSIIndicator, StochasticOscillator
from ta.trend import MACD, ADXIndicator, CCIIndicator
from ta.volatility import BollingerBands


def calculate_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Очекува df со колони: 'open', 'high', 'low', 'close', 'volume'
    Враќа ист df + колони за индикаторите.
    """

    # ===== 5 ОСЦИЛАТОРИ =====
    # 1) RSI
    rsi = RSIIndicator(close=df["close"], window=14)
    df["rsi"] = rsi.rsi()

    # 2) MACD (линија + signal)
    macd = MACD(close=df["close"])
    df["macd"] = macd.macd()
    df["macd_signal"] = macd.macd_signal()

    # 3) Stochastic Oscillator %K
    stoch = StochasticOscillator(
        high=df["high"],
        low=df["low"],
        close=df["close"],
        window=14,
        smooth_window=3,
    )
    df["stoch_k"] = stoch.stoch()
    df["stoch_d"] = stoch.stoch_signal()

    # 4) ADX
    # ADX знае да фрли грешка ако нема доволно редови, па прво проверуваме
    if len(df) > 30:
        adx = ADXIndicator(
            high=df["high"],
            low=df["low"],
            close=df["close"],
            window=14,
        )
        df["adx"] = adx.adx()
    else:
        # ако нема доволно податоци, ставаме NaN
        df["adx"] = np.nan

    # 5) CCI
    cci = CCIIndicator(
        high=df["high"],
        low=df["low"],
        close=df["close"],
        window=20,
    )
    df["cci"] = cci.cci()

    # ===== 5 MOVING AVERAGES / VOLATILITY =====
    # 6) SMA
    df["sma_20"] = df["close"].rolling(window=20).mean()

    # 7) EMA
    df["ema_20"] = df["close"].ewm(span=20, adjust=False).mean()

    # 8) WMA (еден едноставен custom пресмет)
    def wma(series):
        weights = np.arange(1, len(series) + 1)
        return np.dot(series, weights) / weights.sum()

    df["wma_20"] = df["close"].rolling(window=20).apply(wma, raw=True)

    # 9) Bollinger Bands
    bb = BollingerBands(close=df["close"], window=20, window_dev=2)
    df["bb_middle"] = bb.bollinger_mavg()
    df["bb_upper"] = bb.bollinger_hband()
    df["bb_lower"] = bb.bollinger_lband()

    # 10) Volume Moving Average
    df["vma_20"] = df["volume"].rolling(window=20).mean()

    return df


def generate_signal(df: pd.DataFrame) -> str:
    """
    Земаме последен ред и правиме едноставен BUY/SELL/HOLD сигнал.
    Тука можеш после да си играш и да го подобруваш.
    """
    last = df.iloc[-1]

    # Eдноставни правила (пример, не е "свети грал" 🙂)
    if (
        last["close"] > last["sma_20"]     # цена над SMA
        and last["rsi"] < 70              # не е overbought
        and last["macd"] > last["macd_signal"]  # bullish MACD
    ):
        return "BUY"

    if (
        last["rsi"] > 80  # многу overbought
        or last["close"] < last["sma_20"] and last["macd"] < last["macd_signal"]
    ):
        return "SELL"

    return "HOLD"
def analyze_timeframes(df: pd.DataFrame):
    """
    Очекува df со колони: 'timestamp', 'open', 'high', 'low', 'close', 'volume'
    Враќа резултати за 3 timeframes: 1 ден, 1 недела, 1 месец.
    """

    # 1) timestamp -> datetime + index
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.set_index("timestamp").sort_index()

    results = {}

    # дефинираме 3 временски рамки
    timeframes = {
        "1d": "D",  # дневно
        "1w": "W",  # неделно
        "1m": "M",  # месечно
    }

    for label, rule in timeframes.items():
        # 2) resample во дадениот timeframe
        ohlcv = df.resample(rule).agg({
            "open": "first",
            "high": "max",
            "low": "min",
            "close": "last",
            "volume": "sum",
        })

        # ако има празни редови ги фрламе
        ohlcv = ohlcv.dropna()

        # ако нема доволно податоци, прескокни го овој timeframe
        if len(ohlcv) < 20:
            results[label] = {
                "signal": "NOT_ENOUGH_DATA",
                "last_candle": None,
            }
            continue

        # 3) пресметај индикатори
        ohlcv = calculate_indicators(ohlcv)

        # 4) сигнал
        signal = generate_signal(ohlcv)

        # 5) земаме ги последните вредности (последна свеќа)
        last_row = ohlcv.tail(1).to_dict(orient="records")[0]

        results[label] = {
            "signal": signal,
            "last_candle": last_row,
        }

    return results
