import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import AllCoins from "./pages/AllCoins.jsx";
import CoinDetails from "./pages/CoinDetails.jsx";
import PageNotFoundPage from "./pages/PageNotFoundPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CoinsProvider from "./contexts/CoinsContext.jsx";
import TableUiProvider from "./contexts/TableUiContext.jsx";

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
      <TableUiProvider>
        <RouterProvider router={router} />
      </TableUiProvider>
    </CoinsProvider>
  );
}

export default App;
