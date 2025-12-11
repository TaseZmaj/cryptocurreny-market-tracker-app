import {
  Avatar,
  Box,
  FormControlLabel,
  Switch,
  TablePagination,
  TableSortLabel,
  Tooltip,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Fade,
  useColorScheme,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { topBarHeight } from "../../../util/uiVars.js";
import { getComparator } from "../../../util/MaterialUtils.js";
import { formatPrice } from "../../../util/stringFormatting.js";
import SearchInput from "../SearchInput.jsx";
import { tableHeadings } from "../../../util/uiVars.js";
import { useNavigate } from "react-router";
import useCoins from "../../../hooks/useCoins.js";

export default function CoinTable({ sx }) {
  const { coins, coinsLoading, coinsError, getAllCoins } = useCoins();
  const [filteredCoins, setFilteredCoins] = useState(coins);
  const [query, setQuery] = useState("");

  const { navigate } = useNavigate();
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const headings = tableHeadings;

  //MUI boilerplate code - table state
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  //MUI table variables
  const visibleRows = useMemo(() => {
    if (!filteredCoins) return [];
    return [...filteredCoins]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredCoins, order, orderBy, page, rowsPerPage]);

  //MUI table handler functions -----------------------------------------
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };
  //-----------------------------------------------------------

  useEffect(() => {
    getAllCoins();
  }, []);

  //For filtering by name
  //TODO: Write a better query function
  useEffect(() => {
    setFilteredCoins(
      coins.filter((item) =>
        item?.name?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, coins]);

  // useEffect(() => setFilteredCoins(coins, query), [coins, query]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <SearchInput query={query} setQuery={setQuery} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* The Paper and everything below is the Data Table */}
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            // height: `calc(100vh - ${topBarHeight}px - 175px )`,
            maxHeight: "100%",

            mt: "12px",
            flexGrow: 1,

            ...sx,
          }}
        >
          <TableContainer
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "100%",
              scrollbarGutter: "stable",
              // bgcolor: palette.common.white,
            }}
          >
            <Table stickyHeader size={dense ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {headings.map((heading) => (
                    <TableCell
                      variant="head"
                      key={heading}
                      sx={{
                        width: heading === "marketCapRank" && "5%",
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                        backgroundColor:
                          mode === "light"
                            ? palette.common.white
                            : palette.background.default,
                      }}
                      sortDirection={orderBy === heading ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === heading}
                        direction={orderBy === heading ? order : "asc"}
                        onClick={createSortHandler(heading)}
                      >
                        {heading === "marketCapRank" ? "#" : heading}
                        {orderBy === heading ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {coinsError && !coinsLoading ? (
                  <TableRow key="error">
                    <TableCell
                      colSpan={headings.length}
                      sx={{
                        border: 0,
                        height: "100%" /*"561px"*/,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: `calc(100vh - ${topBarHeight}px - 350px)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p>ERROR...</p>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
                {coinsLoading && !coinsError ? (
                  <>
                    <TableRow key="tableItemsLoading">
                      <TableCell
                        colSpan={headings.length}
                        sx={{ border: 0, height: "100%" }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: `calc(100vh - ${topBarHeight}px - 350px)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <p>LOADING...</p>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </>
                ) : null}
                {filteredCoins && !coinsError && !coinsLoading
                  ? visibleRows.map((coin) => (
                      <Tooltip
                        arrow
                        key={coin.id}
                        placement="top"
                        title={`Click for more info about ${coin.name}...`}
                        slots={{
                          transition: Fade,
                        }}
                        slotProps={{
                          transition: { timeout: 500 },
                        }}
                        enterDelay={700}
                        leaveDelay={100}
                      >
                        <TableRow
                          // onClick={() => navigate(`/coin/${}`)}
                          sx={{
                            // "&:last-child td, &:last-child th": { border: 0 },
                            height: !dense ? "59.8px" : undefined,
                            transition: "all 0.22s ease-out",
                            cursor: "pointer",
                            color:
                              mode === "light"
                                ? palette.primary.text
                                : palette.common.white,
                            "&:hover": {
                              backgroundColor:
                                mode === "light"
                                  ? palette.primary.light
                                  : palette.divider,
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {coin.id}
                          </TableCell>
                          <TableCell align="left">{coin.name}&nbsp;</TableCell>
                          <TableCell align="left">{coin.price}</TableCell>
                        </TableRow>
                      </Tooltip>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              borderTop: `1px solid ${palette.divider}`,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "auto",
            }}
          >
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={filteredCoins ? filteredCoins.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ order: 1 }}
            />
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense"
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
