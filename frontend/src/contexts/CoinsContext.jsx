import { createContext, useCallback, useReducer } from "react";
import {
  fetchAllCoinsAsync,
  fetchCoinByIdAsync,
  fetchCoinLSTMPredictionByIdAsync,
  fetchCoinTechnicalAnalysisByIdAsync,
} from "../util/CoinsApi";

const initialState = {
  coinsLoading: false,
  coins: [],
  coinsError: null,

  coinLoading: false,
  coin: null,
  coinError: null,

  coinTechnicalAnalysisLoading: false,
  coinTechnicalAnalysis: {},
  coinTechnicalAnalysisError: null,

  coinLstmPredictionLoading: false,
  coinLstmPredictor: {},
  coinLstmPredictionError: null,
};

function reducer(state, action) {
  switch (action.type) {
    //--- All coins actions ---
    case "coins/loading":
      return { ...state, coinsLoading: true, coinsError: null };
    case "coins/success":
      return {
        ...state,
        coins: action.payload,
        coinsLoading: false,
        coinsError: null,
      };
    case "coins/failedToLoad":
      return { ...state, coinsLoading: false, coinsError: action.payload };

    //--- Single coin actions ---
    case "coin/loading":
      return { ...state, coinLoading: true, coinError: null };
    case "coin/success":
      return {
        ...state,
        coin: action.payload,
        coinLoading: false,
        coinError: null,
      };
    case "coin/failedToLoad":
      return { ...state, coinLoading: false, coinError: action.payload };

    //--- Single coin - technical analysis microservice actions ---
    case "coin/technicalAnalysis/loading":
      return {
        ...state,
        // coinTechnicalAnalysis: {},
        coinTechnicalAnalysisLoading: true,
        coinTechnicalAnalysisError: null,
      };
    case "coin/technicalAnalysis/success":
      return {
        ...state,
        coinTechnicalAnalysis: action.payload,
        coinTechnicalAnalysisLoading: false,
        coinTechnicalAnalysisError: null,
      };
    case "coin/technicalAnalysis/failedToLoad":
      return {
        ...state,
        coinTechnicalAnalysisLoading: false,
        coinTechnicalAnalysisError: action.payload,
      };

    //--- Single coin - LSTM Prediction microservice actions ---
    case "coin/lstmPrediction/loading":
      return {
        ...state,
        // coinTechnicalAnalysis: {},
        coinLstmPredictionLoading: true,
        coinLstmPredictionError: null,
      };
    case "coin/lstmPrediction/success":
      return {
        ...state,
        coinLstmPrediction: action.payload,
        coinLstmPredictionLoading: false,
        coinLstmPredictionError: null,
      };
    case "coin/lstmPrediction/failedToLoad":
      return {
        ...state,
        coinLstmPredictionLoading: false,
        coinLstmPredictionError: action.payload,
      };

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
        // dispatch({
        //   type: "coin/technicalAnalysis/success",
        //   payload: coinTechnicalAnalysis,
        // });
        // dispatch({
        //   type: "coin/lstmPrediction/success",
        //   payload: coinLstmPrediction,
        // });
      } catch (err) {
        dispatch({
          type: "coin/failedToLoad",
          payload: err.message,
        });
      }
    },
    [dispatch]
  );

  const getCoinTechnicalAnalysisById = useCallback(
    async (id) => {
      dispatch({ type: "coin/technicalAnalysis/loading" });

      try {
        const coinTechnicalAnalysis = await fetchCoinTechnicalAnalysisByIdAsync(
          id
        );
        dispatch({
          type: "coin/technicalAnalysis/success",
          payload: coinTechnicalAnalysis,
        });
      } catch (err) {
        dispatch({
          type: "coin/technicalAnalysis/failedToLoad",
          payload: err.message,
        });
      }
    },
    [dispatch]
  );

  const getCoinLstmPredictionById = useCallback(
    async (id) => {
      dispatch({ type: "coin/lstmPrediction/loading" });

      try {
        const coinLstmPrediction = await fetchCoinLSTMPredictionByIdAsync(id);
        dispatch({
          type: "coin/lstmPrediction/success",
          payload: coinLstmPrediction,
        });
      } catch (err) {
        dispatch({
          type: "coin/lstmPrediction/failedToLoad",
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
        getCoinTechnicalAnalysisById,
        getCoinLstmPredictionById,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
}

export { CoinsContext };
