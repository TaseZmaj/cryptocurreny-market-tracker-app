import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import AllCoins from "./pages/AllCoins.jsx";
import CoinDetails from "./pages/CoinDetails.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoinsProvider from "./contexts/CoinsContext.jsx";
// import SingleCoinErrorPage from "./pages/SingleCoinErrorPage.jsx";

//TODO: Add the coin not found page - so that if a user goes /coin/coinId but that coinId does not exist, it will show a page that says "Coin Not Found" instead of the generic 404 page. This is different from the Single Coin Error page, which is for when the coin exists but there was an error fetching the data from the API. The Coin Not Found page should be displayed when the coin does not exist in the database at all.
//TODO: Add a Single Coin Error page - where the code did not load successfully, but the coin exists. This is different from the Coin Not Found page, which is for when the coin does not exist at all. The Single Coin Error page should be displayed when there is an error fetching the coin data from the API, but the coin exists in the database.
//TODO: Fix PageNotFoundPage so that it matches urls like /coins/asaosjoaijd, not just /asaosjoaijd
//TODO:
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
        element: <PageNotFoundPage />,
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
