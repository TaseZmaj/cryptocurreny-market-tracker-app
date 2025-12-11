// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import CoinTable from "./components/CoinTable";
// import CoinDetail from "./components/CoinDetail";
// import CoinHistory from "./components/CoinHistory";

import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import AllCoins from "./pages/AllCoins.jsx";
import CoinDetails from "./pages/CoinDetails.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoinsProvider from "./contexts/CoinsContext.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/coins",
        element: <AllCoins />,
      },
      {
        path: "/coins/:coinId",
        element: <CoinDetails />,
      },
    ],
  },
]);

function App() {
  return (
    <CoinsProvider>
      <RouterProvider router={router} />
    </CoinsProvider>
  );

  // return (
  //   <div className="App-Layout">
  //     <header style={{ padding: "10px 20px", borderBottom: "1px solid #ccc" }}>
  //       <h1>Cryptocurrency Market Tracker</h1>
  //     </header>
  //     <main style={{ padding: "20px" }}>
  //       <Routes>
  //         {/* 1. Coin List Route */}
  //         <Route path="/" element={<CoinTable />} />
  //         {/* 2. Dynamic Detail Route: /coins/anything */}
  //         <Route path="/coins/:coinId" element={<CoinDetail />}>
  //           {/* 3. Nested History Route: /coins/anything/history */}
  //           <Route path="history" element={<CoinHistory />} />
  //         </Route>
  //         <Route path="*" element={<h2>404 Page Not Found</h2>} />
  //       </Routes>
  //     </main>
  //   </div>
  // );
}

export default App;
