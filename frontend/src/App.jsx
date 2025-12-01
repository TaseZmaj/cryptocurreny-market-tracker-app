import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CoinTable from "./components/CoinTable";
import CoinDetail from "./components/CoinDetail";
import CoinHistory from "./components/CoinHistory";

function App() {
  return (
    <div className="App-Layout">
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
        <h1>Cryptocurrency Market Tracker</h1>
      </header>

      <main style={{ padding: "20px" }}>
        <Routes>
          {/* 1. Coin List Route */}
          <Route path="/" element={<CoinTable />} />

          {/* 2. Dynamic Detail Route: /coins/anything */}
          <Route path="/coins/:coinId" element={<CoinDetail />}>
            {/* 3. Nested History Route: /coins/anything/history */}
            <Route path="history" element={<CoinHistory />} />
          </Route>

          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
