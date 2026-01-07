export function tableQuery(query, coins, setFilteredCoins) {
  const q = query.toLowerCase().trim();

  if (!q) {
    setFilteredCoins(coins);
    return;
  }

  const filtered = coins.filter((coin) => {
    return (
      String(coin.marketCapRank).toLowerCase().includes(q) ||
      String(coin.name).toLowerCase().includes(q) ||
      String(coin.symbol).toLowerCase().includes(q) ||
      String(coin.price).toLowerCase().includes(q) ||
      String(coin.volume24h).toLowerCase().includes(q) ||
      String(coin.high24h).toLowerCase().includes(q) ||
      String(coin.low24h).toLowerCase().includes(q) ||
      String(coin.liquidity).toLowerCase().includes(q)
    );
  });

  setFilteredCoins(filtered);
}

//Because filtering of the data is expensive and lags the app,
//this function inserts a delay when accessing the tableQuery()
//so that the searching doesn't happen right after each letter is
//typed
export function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
