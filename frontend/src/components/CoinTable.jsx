import React from "react";
import useApiData from "../hooks/useApiData";
import { Link } from "react-router-dom";

//API Endpoint
const ENDPOINT = "http://localhost:8080/api/coins";

// Define a list of keys you want to exclude from the table
const EXCLUDED_HEADERS = [
  "lastDataFetchDate", // ⬅️ The field you want to remove
  // "id", // You might also want to remove 'id' if you don't need it visually
];

// Define a small reusable style object for the status indicator
const activeIndicatorStyle = {
  height: "10px",
  width: "10px",
  borderRadius: "50%",
  display: "inline-block",
  marginLeft: "5px",
};

function CoinTable() {
  const { data: coins, isLoading, error } = useApiData(ENDPOINT);

  if (isLoading) {
    return <div>Loading coins...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error loading data: {error}</div>;
  }

  if (!coins || coins.length === 0) {
    return <div>No coins found</div>;
  }

  // 1. Get ALL keys from the first object
  const allHeaders = Object.keys(coins[0]);

  // 2. Filter the headers list to exclude the unwanted fields
  const headers = allHeaders.filter(
    (header) => !EXCLUDED_HEADERS.includes(header)
  );
  // ⬅️ This is the key change!

  // Render list of coins
  return (
    <div>
      <h2>💰 Cryptocurrency Market Overview</h2>
      <table
        className="coin-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {/* Format the header name for readability */}
                {header.charAt(0).toUpperCase() +
                  header
                    .slice(1)
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} style={{ cursor: "pointer" }}>
              {headers.map(
                (
                  key // Iterating over the FILTERED 'headers' list
                ) => (
                  <td
                    key={key}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {/* --- Logic for rendering 'active' status --- */}
                    {key === "active" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {coin[key] ? "Active" : "Inactive"}
                        <div
                          style={{
                            ...activeIndicatorStyle,
                            backgroundColor: coin[key] ? "green" : "red",
                          }}
                        ></div>
                      </div>
                    ) : key === "name" ? (
                      // --- Logic for the 'name' column (clickable link) ---
                      <Link
                        to={`/coins/${coin.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#007bff",
                          fontWeight: "bold",
                        }}
                      >
                        {coin[key]}
                      </Link>
                    ) : (
                      // --- Default rendering for all other columns ---
                      coin[key]
                    )}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CoinTable;
