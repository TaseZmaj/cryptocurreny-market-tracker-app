//Table heading cells for the main Coins table
export const tableCellsPadding = { xs: "8px", md: "16px" };
export const tableCellsPricePadding = { xs: "12px", md: "16px" };

export const headCells = [
  {
    id: "marketCapRank",
    numeric: true,
    label: "#",
    width: "5%",
  },
  {
    id: "name",
    numeric: false,
    label: "Name",
    width: "20%",
  },
  {
    id: "symbol",
    numeric: false,
    label: "Symbol",
    width: "7%",
  },
  {
    id: "lastPrice",
    numeric: true,
    label: "Price",
    width: "13.666667%",
  },
  {
    id: "volume24h",
    numeric: true,
    label: "Volume 24h",
    width: "13.666667%",
  },
  {
    id: "high24h",
    numeric: true,
    label: "High 24h",
    width: "13.666667%",
  },
  {
    id: "low24h",
    numeric: true,
    label: "Low 24h",
    width: "13.666667%",
  },
  {
    id: "liquidity24h",
    numeric: true,
    label: "Liquidity",
    width: "13.666667%",
  },
];

//UI Variables
export const topBarHeightRaw = 92;
export const topBarHeight = topBarHeightRaw + "px";

export const footerHeight = "52px";
export const darkBackgroundColor = "#121212";
