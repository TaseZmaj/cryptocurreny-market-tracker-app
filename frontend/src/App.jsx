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
import SingleCoinErrorPage from "./pages/SingleCoinErrorPage.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
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
      {
        path: "*",
        element: <ErrorPage />,
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
}

export default App;
