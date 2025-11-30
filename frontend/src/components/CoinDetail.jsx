import React from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import useApiData from "../hooks/useApiData";

function CoinDetail() {
  const { coinId } = useParams();
  const COIN_DETAIL_URL = `http://localhost:8080/api/coins/${coinId}`;

  const { data: coin, isLoading, error } = useApiData(COIN_DETAIL_URL);

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>Loading details for **{coinId}**...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        Error fetching detail: {error}
      </div>
    );
  }

  if (!coin) {
    return <div style={{ padding: "20px" }}>Coin **{coinId}** not found.</div>;
  }

  // Helper function to format prices as currency
  const formatCurrency = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: coin.quoteAsset || "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Helper function to format the date/time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}
    >
      {/* --- Static Coin Details --- */}
      <h1>
        📊 {coin.name} ({coin.symbol})
      </h1>
      <p>Market Cap Rank: **#{coin.marketCapRank}**</p>
      <p>Quote Asset: **{coin.quoteAsset}**</p>
      <p>Active Status: {coin.active ? "🟢 Active" : "🔴 Inactive"}</p>
      <p>Summary Last Updated: {formatDateTime(coin.summaryUpdatedAt)}</p>

      <hr style={{ margin: "20px 0" }} />

      {/* --- 24-Hour Summary Data (NEW SECTION) --- */}
      <h2>🕐 24-Hour Summary</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
        }}
      >
        <div>**Last Price:** {formatCurrency(coin.lastPrice)}</div>
        <div>**24h Volume:** {formatCurrency(coin.volume24h)}</div>
        <div>**24h High:** {formatCurrency(coin.high24h)}</div>
        <div>**24h Low:** {formatCurrency(coin.low24h)}</div>
        <div>**24h Liquidity:** {formatCurrency(coin.liquidity24h)}</div>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* --- History Navigation and Outlet --- */}
      <nav>
        <Link
          to="history"
          style={{
            padding: "8px 15px",
            border: "1px solid #007bff",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          View 10-Year History
        </Link>
      </nav>

      <div style={{ marginTop: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default CoinDetail;
