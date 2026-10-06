import { useContext } from "react";
import { TableUiContext } from "../contexts/TableUiContext.jsx";

export default function useTableUi() {
  const context = useContext(TableUiContext);
  if (!context) {
    throw new Error(
      "Error: TableUiContext was used outside of TableUiProvider!",
    );
  }
  return context;
}
