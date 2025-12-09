import pandas as pd
from technical_indicators import (
    calculate_indicators,
    generate_signal,
    analyze_timeframes,
)

# Правиме лажни податоци (како да се историски цени)
data = {
    "open":  [100, 102, 101, 103, 104, 105, 106, 108, 110, 111, 112, 113, 115, 117, 118, 119, 120, 121, 122, 123, 124],
    "high":  [101, 103, 102, 104, 105, 106, 107, 109, 111, 112, 113, 114, 116, 118, 119, 120, 121, 122, 123, 124, 125],
    "low":   [99,  101, 100, 102, 103, 104, 105, 107, 109, 110, 111, 112, 114, 116, 117, 118, 119, 120, 121, 122, 123],
    "close": [100.5, 102.5, 101.5, 103.5, 104.5, 105.5, 106.5, 108.5, 110.5, 111.5,
              112.5, 113.5, 115.5, 117.5, 118.5, 119.5, 120.5, 121.5, 122.5, 123.5, 124.5],
    "volume": [1000, 1100, 1050, 1200, 1300, 1400, 1500, 1600, 1550, 1700,
               1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800],
}

# Додаваме timestamps (еден дневно)
data["timestamp"] = pd.date_range(start="2024-01-01", periods=len(data["close"]), freq="D")

df = pd.DataFrame(data)

# СТАРИОТ ДЕЛ - еднотајмфрејм анализа (по желба – можеш да го оставиш)
df_with_indicators = calculate_indicators(df.copy())
signal = generate_signal(df_with_indicators)

print("=== ЕДЕН TIMEFRAME (СИТЕ ДЕНОВИ ЗАЕДНО) ===")
print(df_with_indicators.tail(1).T)
print("\nСигнал:", signal)

# НОВИОТ ДЕЛ - анализа по 3 временски рамки
print("\n\n=== TIMEFRAME ANALYSIS (1D, 1W, 1M) ===")
results = analyze_timeframes(df)

for tf, res in results.items():
    print(f"\nTimeframe: {tf}")
    print("Signal:", res["signal"])
    print("Last candle + indicators:")
    print(res["last_candle"])
