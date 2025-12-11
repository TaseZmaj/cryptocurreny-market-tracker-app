import { useContext } from "react";
import { CoinsContext } from "../contexts/CoinsContext.jsx";

export default function useCoins() {
  const context = useContext(CoinsContext);
  if (!context)
    throw new Error("Error: CoinsContext was used outside of CoinsProvider!");
  return context;
}
