import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import AllCoins from "./pages/AllCoins.jsx";
import CoinDetails from "./pages/CoinDetails.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoinsProvider from "./contexts/CoinsContext.jsx";
// import SingleCoinErrorPage from "./pages/SingleCoinErrorPage.jsx";

//TODO: Add the loading states in the Single Coin Page
//TODO: Add the coin not found page
//TODO: Add mobile responsivity
//TODO: Add animations
//TODO: Refactor SingleCoinErrorPage and ErrorPage into a single component
//a lot of the code is the same

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
