import { useParams } from "react-router-dom";
import useApiData from "../hooks/useApiData";
import { formatDate, formatPrice } from "../util/stringFormatting";

function CoinHistory() {
  const { coinId } = useParams();

  // Endpoint URL remains the same
  const HISTORY_URL = `http://localhost:8080/api/coins/${coinId}/history`;

  const { data: historyData, isLoading, error } = useApiData(HISTORY_URL);

  // --- Conditional Rendering ---

  if (isLoading) {
    return (
      <p style={{ marginTop: "20px" }}>
        Fetching 10-year history for {coinId}...
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ color: "red", marginTop: "20px" }}>
        Error fetching history: {error}
      </p>
    );
  }

  if (!historyData || historyData.length === 0) {
    return (
      <p style={{ marginTop: "20px" }}>
        No historical data available for {coinId}.
      </p>
    );
  }

  // --- Render History Data Table ---
  return (
    <div
      style={{
        marginTop: "30px",
        borderTop: "1px solid #eee",
        paddingTop: "20px",
      }}
    >
      <h3>📈 10-Year Price History (or less) for {coinId.toUpperCase()}</h3>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Open</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Close</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>High</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Low</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Volume</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((item) => (
            // Using the unique 'id' from the history object as the key
            <tr key={item.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatDate(item.timestamp)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatPrice(item.open)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatPrice(item.close)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatPrice(item.high)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {formatPrice(item.low)}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {item.totalVolume.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoinHistory;
