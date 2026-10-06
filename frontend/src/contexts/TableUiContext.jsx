import { createContext, useState } from "react";

const TableUiContext = createContext();

export default function TableUiProvider({ children }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("marketCapRank");
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [query, setQuery] = useState("");

  return (
    <TableUiContext.Provider
      value={{
        order,
        setOrder,
        orderBy,
        setOrderBy,
        page,
        setPage,
        dense,
        setDense,
        rowsPerPage,
        setRowsPerPage,
        query,
        setQuery,
      }}
    >
      {children}
    </TableUiContext.Provider>
  );
}

export { TableUiContext };
