import { useState, useMemo, useEffect, memo } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import {
  darkBackgroundColor,
  footerHeight,
  topBarHeight,
  headCells,
} from "../../util/uiVars.js";
import SearchInput from "./SearchInput.jsx";
import { getComparator } from "../../util/MaterialUtils.js";
import { useColorScheme } from "@mui/material/styles";
import useCoins from "../../hooks/useCoins.js";
import { tableQuery } from "./tableQuery.js";
import { FormControlLabel, Switch, Tooltip } from "@mui/material";
import MessageBox from "./MessageBox.jsx";
import LoadingTableCell from "../../components/LoadingTableCell.jsx";
import { formatCryptoPrice } from "../../util/stringUtils.js";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { getCsvAll24hData } from "../../util/CoinsApi.js";
import SquareButton from "../../components/SquareButton.jsx";

export default function CoinTable() {
  const { coins, coinsLoading, coinsError, getAllCoins } = useCoins();
  const [query, setQuery] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const stableCoins = useMemo(() => coins, [coins]);

  // MUI table state --------------------------------
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("marketCapRank");
  // const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  // MUI tabble state -------------------------------

  //   MUI Table handler funcions and vars  -----------------------------------
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // eslint-disable-next-line no-unused-vars
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCoins.length) : 0;
  //  MUI Table handler funcions and vars -----------------------------------

  //On mount - fetch all coins
  useEffect(() => {
    if (coins.length === 0) getAllCoins();
  }, [getAllCoins, coins.length]);

  //On change of the input - set the filteredCoins
  useEffect(() => {
    const timer = setTimeout(() => {
      tableQuery(query, stableCoins, setFilteredCoins);
    }, 225);
    return () => clearTimeout(timer);
  }, [query, stableCoins]);

  //BEHIND THE SCENES BROWSER OPTIMIZATION -----------------------------------------
  //This makes all icons warm in cache before rendering. Sorting becomes smooth.
  //This works behind the scenes in the browser.  We create an <img> element in
  //memory. It does NOT appear in the DOM, and it NEVER gets added to the UI. It's
  //only purpose is for loading.  THE MOMENT the img.src is set, the browser starts
  //downloading the image in the background, decodes the .png and caches the decoded
  //image in memory cache
  useEffect(() => {
    stableCoins.forEach((c) => {
      const img = new Image();
      img.src = c.coinIconUrl;
    });
  }, [stableCoins]);
  // ------------------------------------------------------------------------------

  const sortedCoins = useMemo(() => {
    const data = filteredCoins.length || query ? filteredCoins : stableCoins;
    return [...data].sort(getComparator(order, orderBy));
  }, [filteredCoins, stableCoins, order, orderBy, query]);

  const visibleRows = useMemo(() => {
    return sortedCoins.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedCoins, page, rowsPerPage]);

  //Mandatory todos:
  // TODO: Implement the different buttons - columns, filters, density and refresh

  //Optional:
  // TODO: Change the icon component in the table headers to a different arrow
  // TODO: Add animations

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 1,
        }}
      >
        <SquareButton
          onClick={() => {
            getCsvAll24hData();
          }}
          type="exportToCsv24h"
          sx={{ width: "40px", height: "40px", mr: "11px" }}
        ></SquareButton>
        <SearchInput query={query} setQuery={setQuery} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: `calc(100vh - ${topBarHeight} - ${footerHeight} - 90px)`,
          overflow: "hidden",
          backgroundColor:
            mode === "light" ? palette.background.paper : "transparent",
        }}
      >
        <TableContainer
          sx={{
            // overflow: coinsError ? "hidden" : "auto",
            borderBottom:
              mode === "light" ? "none" : `1px solid ${palette.grey[800]}`,
          }}
        >
          <Table
            sx={{
              width: "100%",
              minWidth: 650,
            }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            stickyHeader
          >
            <EnhancedTableHead
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={
                (filteredCoins.length ? filteredCoins : stableCoins).length
              }
            />

            <TableBody>
              {/* All coins loading */}
              {coinsLoading && !coinsError
                ? Array.from({ length: 10 }).map((_el, i) => (
                    <TableRow
                      key={i}
                      tabIndex={-1}
                      slotprops={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -14],
                              },
                            },
                          ],
                        },
                      }}
                      sx={{
                        border: "none",
                        cursor: "pointer",
                        height: "58px",
                        "& td": {
                          borderBottom:
                            mode === "light"
                              ? `1px solid ${palette.divider}`
                              : `1px solid ${palette.grey[800]}`,
                        },
                      }}
                    >
                      {headCells.map((_el, i) => (
                        <TableCell
                          key={i}
                          scope="row"
                          sx={{
                            width: "36px",
                            height: "25px",
                            color:
                              mode === "light"
                                ? palette.text.primary
                                : palette.common.white,
                          }}
                        >
                          {/* Loading gray box */}
                          <LoadingTableCell />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}

              {/* All coins error */}
              {!coinsLoading && coinsError ? (
                <TableRow
                  tabIndex={-1}
                  sx={{
                    border: "none",
                    height: "100%",
                  }}
                >
                  <TableCell
                    colSpan={headCells.length}
                    sx={{
                      border: "none",
                      color:
                        mode === "light"
                          ? palette.text.primary
                          : palette.common.white,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: `calc(100vh - ${topBarHeight} - ${footerHeight} - 260px)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MessageBox
                        type="error"
                        title="Error!"
                        buttonType="refresh"
                        onClickFunc={getAllCoins}
                      >
                        {coinsError}
                      </MessageBox>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}

              {/* Coins table display */}
              {coins && !coinsLoading && !coinsError
                ? visibleRows.map((coin) => {
                    return <CoinRow key={coin.coinId} coin={coin} />;
                  })
                : null}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                  sx={{
                    "& td": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 250]}
          component="div"
          count={(filteredCoins.length ? filteredCoins : stableCoins).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            mt: "auto",
            overflow: "hidden",
            minHeight: "52px",
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                color:
                  mode === "light"
                    ? palette.text.primary
                    : palette.common.white,
              },
            ".MuiSvgIcon-root": {
              color:
                mode === "light" ? palette.text.primary : palette.common.white,
            },
          }}
        />
      </Box>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow
        sx={{
          "& th": {
            borderBottom: "none",
            borderTop:
              mode === "light"
                ? `1px solid ${palette.divider}`
                : `1px solid ${palette.grey[800]}`,
          },
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              boxSizing: "border-box",
              height: "25px",
              maxHeight: "25px",
              width: headCell.width,
              backgroundColor:
                mode === "light"
                  ? palette.background.paper
                  : darkBackgroundColor,
              color:
                mode === "light" ? palette.common.black : palette.common.white,
            }}
            key={headCell.id}
            align={
              headCell.id === "marketCapRank"
                ? "left"
                : headCell.numeric
                ? "right"
                : "left"
            }
            // padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                "& .MuiTableSortLabel-icon": {
                  color:
                    mode === "light"
                      ? palette.common.black
                      : palette.common.white,
                },
                "&.Mui-active .MuiTableSortLabel-icon": {
                  color:
                    mode === "light"
                      ? palette.common.black
                      : palette.common.white,
                },
                "&:hover .MuiTableSortLabel-icon": {
                  color:
                    mode === "light"
                      ? palette.common.black
                      : palette.common.white,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: "600",
                  color:
                    mode === "light"
                      ? palette.common.black
                      : palette.common.white,
                }}
              >
                {headCell.label}
              </Typography>

              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const CoinRow = memo(function CoinRow({ coin }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();
  const navigate = useNavigate();

  return (
    <Tooltip
      enterDelay={300}
      title={`Click for more info about ${coin.name} - ${coin.symbol}`}
      placement="top"
    >
      <TableRow
        onClick={() => navigate(`/coins/${coin.coinId}`)}
        tabIndex={-1}
        slotprops={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -14],
                },
              },
            ],
          },
        }}
        sx={{
          border: "none",
          cursor: "pointer",
          height: "58px",
          "&:hover": {
            backgroundColor: mode === "light" ? blue[50] : palette.grey[900],
          },
          transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1) 25ms",
          "& td": {
            borderBottom:
              mode === "light"
                ? `1px solid ${palette.divider}`
                : `1px solid ${palette.grey[800]}`,
          },
        }}
      >
        <TableCell
          scope="row"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {coin.marketCapRank}
        </TableCell>

        <TableCell
          align="left"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={coin.coinIconUrl}
              alt={coin.name}
              width={27}
              height={27}
              style={{ borderRadius: "50%", marginRight: "10px" }}
            />

            <Typography fontWeight={500}>{coin.name}</Typography>
          </Box>
        </TableCell>

        <TableCell
          align="left"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {coin.symbol}
        </TableCell>

        <TableCell
          align="right"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {formatCryptoPrice(coin.lastPrice)}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {formatCryptoPrice(coin.volume24h)}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {formatCryptoPrice(coin.high24h)}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {formatCryptoPrice(coin.low24h)}
        </TableCell>
        <TableCell
          align="right"
          sx={{
            color:
              mode === "light" ? palette.text.primary : palette.common.white,
          }}
        >
          {formatCryptoPrice(coin.liquidity24h)}
        </TableCell>
      </TableRow>
    </Tooltip>
  );
});
