import { createContext, useReducer } from "react";
import {
  fetchAllCoinsAsync,
  fetchCoinByIdAsync,
} from "../features/CoinTable/CoinsApi";

const initialState = {
  coinsLoading: false,
  coinLoading: false,
  coins: [],
  coin: null,
  coinError: null,
  coinsError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "coins/loading":
      return { ...state, coinsLoading: true, coinsError: null };
    case "coin/loading":
      return { ...state, coinLoading: true, coinError: null };
    case "coins/success":
      return {
        ...state,
        coins: action.payload,
        coinsLoading: false,
        coinsError: null,
      };
    case "coin/success":
      return {
        ...state,
        coin: action.payload,
        coinLoading: false,
        coinError: null,
      };
    case "coins/failedToLoad":
      return { ...state, coinsLoading: false, coinsError: action.payload };
    case "coin/failedToLoad":
      return { ...state, coinLoading: false, coinError: action.payload };
    default:
      throw new Error(
        `Error: Unknown action type in CoinsContext reducer ${action.type}`
      );
  }
}

const CoinsContext = createContext();

export default function CoinsProvider({ children }) {
  const [
    { coinsLoading, coinLoading, coins, coin, coinError, coinsError },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function getAllCoins() {
    dispatch({ type: "coins/loading" });

    try {
      const coins = await fetchAllCoinsAsync();
      dispatch({ type: "coins/success", payload: coins });
    } catch (err) {
      dispatch({
        type: "coins/failedToLoad",
        payload: err.message,
      });
    }
  }

  async function getCoinById(id) {
    dispatch({ type: "coin/loading" });

    try {
      const coin = await fetchCoinByIdAsync(id);
      dispatch({ type: "coin/success", payload: coin });
    } catch (err) {
      dispatch({
        type: "coin/failedToLoad",
        payload: err.message,
      });
    }
  }

  return (
    <CoinsContext.Provider
      value={{
        coinsLoading,
        coinLoading,
        coins,
        coin,
        coinError,
        coinsError,
        getAllCoins,
        getCoinById,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
}

export { CoinsContext };
