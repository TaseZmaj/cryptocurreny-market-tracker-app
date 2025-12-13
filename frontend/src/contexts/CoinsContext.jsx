import { createContext, useCallback, useReducer } from "react";
import { fetchAllCoinsAsync, fetchCoinByIdAsync } from "../util/CoinsApi";

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

  const getAllCoins = useCallback(async () => {
    dispatch({ type: "coins/loading" });

    try {
      const coins = await fetchAllCoinsAsync();
      dispatch({ type: "coins/success", payload: coins });
    } catch {
      dispatch({
        type: "coins/failedToLoad",
        payload:
          "There was an error while trying to fetch coins from the database.",
      });
    }
  }, [dispatch]);

  const getCoinById = useCallback(
    async (id) => {
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
    },
    [dispatch]
  );

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
