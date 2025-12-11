import { useState, useMemo } from "react";
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
} from "../../util/uiVars.js";
import SearchInput from "./SearchInput.jsx";
import { getComparator } from "../../util/MaterialUtils.js";
import { useColorScheme } from "@mui/material/styles";

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
  createData(9, "KitKat", 518, 26.0, 65, 7.0),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0),
  createData(11, "Marshmallow", 318, 0, 81, 2.0),
  createData(12, "Nougat", 360, 19.0, 9, 37.0),
  createData(13, "Oreo", 437, 18.0, 63, 4.0),
];

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Calories",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "Fat (g)",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Carbs (g)",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const { palette } = useTheme();
  const { mode } = useColorScheme();

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead
      sx={
        {
          // or palette.background.dark if you defined it
        }
      }
    >
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              backgroundColor:
                mode === "light"
                  ? palette.background.paper
                  : darkBackgroundColor,
              color:
                mode === "light" ? palette.common.black : palette.common.white,
            }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
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

export default function CoinTable() {
  const [query, setQuery] = useState("");
  const { mode } = useColorScheme();

  // MUI table state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { palette } = useTheme();

  //   MUI Table handlers -----------------------------------
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  // -------------------------------------------------------

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  // TODO: Make the border colors way more faint - light grayish
  // TODO: Implement skeleton loading
  // TODO: Implement the different buttons - columns, filters, density and refresh
  // TODO: Add icons near the names of the coins via an API
  // TODO: Add a hover effect on click
  // TODO: Add a tooltip on click
  // TODO: Add animations - optional
  // TODO: Make the search input work - make a better search query function

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
        <TableContainer>
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
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      height: "58px",
                    }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      {row.calories}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      {row.fat}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      {row.carbs}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      {row.protein}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                  sx={{
                    "& td": {
                      borderBottom: "none", // ← removes the border!
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
          count={rows.length}
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
