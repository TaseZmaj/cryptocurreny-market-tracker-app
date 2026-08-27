import { Box, Grid, Typography, useColorScheme, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import useCoins from "../hooks/useCoins";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CoinPropertyCard from "../features/SingleCoinDisplay/MainTitle/CoinPropertyCard.jsx";
import { formatDate } from "../util/stringUtils.js";
import PriceDataCard from "../features/SingleCoinDisplay/PriceDataCard.jsx";
import CandlestickChart from "../features/SingleCoinDisplay/Charts/CandlestickChart.jsx";
import ApexCandlestickChart from "../features/SingleCoinDisplay/Charts/ApexCandlestickChart.jsx";
import ChartDateControlButton from "../features/SingleCoinDisplay/Charts/ChartDateControlButton.jsx";
import useWindowWidth from "../hooks/useWindowWidth.js";
import VolumeChart from "../features/SingleCoinDisplay/Charts/VolumeChart.jsx";
import SquareButton from "../components/SquareButton.jsx";
import { getCsvByIdAsync } from "../util/CoinsApi.js";
import MicroserviceDataCard from "../features/SingleCoinDisplay/MicroservicesUi/MicroserviceDataCard.jsx";
import CardTitle from "../features/SingleCoinDisplay/CardTitle.jsx";
import { useSearchParams } from "react-router-dom";
import CoinTitle from "../features/SingleCoinDisplay/MainTitle/CoinTitle.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

// Valid ranges from the date picker
const VALID_RANGES = ["1D", "1W", "1M", "6M", "1Y", "YTD"];

// Default date picker state
const DEFAULT_RANGE = "1M";

const PARAM = "date-range";

//<datepicker-value> : <number-of-days>
const DAYS_MAP = {
  "1D": 1,
  "1W": 7,
  "1M": 31,
  "6M": 31 * 6,
  "1Y": 365,
  YTD: Infinity,
};

function CoinDetails() {
  const { palette } = useTheme();
  const { pathname } = useLocation();
  const { mode } = useColorScheme();
  const width = useWindowWidth();

  const {
    coin,
    coinError,
    coinLoading,
    getCoinById,
    getCoinTechnicalAnalysisById,
    getCoinLstmPredictionById,
  } = useCoins();

  // ================ RESIZING logic ================
  //selects the Big Coin title
  const titleRef = useRef(null);
  const [wrapped, setWrapped] = useState(false);
  // ================================================

  const coinIdFromPathname = pathname.split("/").at(-1);

  // =================== SYNC URL pathname with date range state ==========
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeFromUrl = searchParams.get(PARAM);
  const dateRange = VALID_RANGES.includes(rangeFromUrl)
    ? rangeFromUrl
    : DEFAULT_RANGE;

  const setRange = (newRange) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set(PARAM, newRange);
      return params;
    });
  };
  // ======================================================================

  //=================== DATE PICKER RADIO BUTTONS logic ======================
  // const [datePicker, setDatePicker] = useState("1M"); //1W, 1M, 6M, 1Y, YTD
  const [formattedCoinOhlcvData, setFormattedCoinOhlcvData] = useState([]);

  function handleFormatCoinOhlcvData() {
    if (!coin || !coin.dataOHLCV || coin.dataOHLCV.length === 0) {
      setFormattedCoinOhlcvData([]);
      return;
    }

    const limit = DAYS_MAP[searchParams.get(PARAM)];

    // Keep data ascending (old → new)
    const source = [...coin.dataOHLCV].reverse();

    const sliced =
      limit === Infinity
        ? source
        : source.slice(-Math.min(limit, source.length)); // still ascending

    const formatted = sliced.map((ohlcv) => ({
      open: ohlcv.open,
      high: ohlcv.high,
      low: ohlcv.low,
      close: ohlcv.close,
      volume: ohlcv.totalVolume,
      date: ohlcv.timestamp,
    }));

    setFormattedCoinOhlcvData(formatted);
  }

  //====================== DATA FORMATTING ================================
  //Refilters the data on change of the Date picker, on change of the coin,
  //and on mount of the component
  useEffect(() => {
    handleFormatCoinOhlcvData(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, coin]);
  // =====================================================================

  //====================== DATA FETCHING LOGIC ==========================
  //Fetches on mount AND every 10 minutes (backend also updates data on
  //every 10 minutes)
  useEffect(() => {
    const fetchData = () => {
      // if (!coin || String(coin.coinId) !== String(coinIdFromPathname)) {
      getCoinById(coinIdFromPathname);
      getCoinTechnicalAnalysisById(coinIdFromPathname);
      getCoinLstmPredictionById(coinIdFromPathname);
      // }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 600_000);

    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinIdFromPathname]);
  //=====================================================================

  // ====================== TITLE WRAP logic ============================
  // TODO: NOTE: Something may be broken here, check logic
  //Checks
  //single-line? -> scrollHeight = lineHeight
  //multi-line -> scrollHeight = lineHeight
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    setWrapped(el.scrollHeight > lineHeight * 1.2);
  }, [coin?.name]);

  // ============ SYNC Search params to datepicker state ==============
  useEffect(() => {
    if (!rangeFromUrl || !VALID_RANGES.includes(rangeFromUrl)) {
      setSearchParams({ [PARAM]: DEFAULT_RANGE }, { replace: true });
    }
  }, [rangeFromUrl, setSearchParams]);
  // ===================================================================

  //TODO: Fix the reset zoom button - KOCKASTO KOPCHE napravi i stavi go najlevo maybe?

  return (
    <Box
      sx={{
        // display: { xs: "flex", md: "grid" },
        // flexDirection: { xs: "column", md: undefined },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        height: "100%",
        overflowY: { xs: "auto !important", md: "hidden" },
        minWidth: 0,
      }}
    >
      {/* Title and 24h data - left side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "413px" },
          height: { xs: "auto", md: "100%" },
          minHeight: { xs: "auto", md: 0 },
          flexShrink: 0,
          position: "relative",
          overflowY: "hidden !important",
          zIndex: 1,
          backgroundColor:
            mode === "light" ? palette.common.white : palette.background.dark,
          // maxHeight: "745px",
          p: "0 30px 20px 30px",
          boxSizing: "border-box",
          // backgroundColor: palette.grey[300],
          borderRight: {
            xs: "none",
            md: `1px solid ${
              mode === "light" ? palette.divider : palette.grey[900]
            }`,
          },
        }}
      >
        {/* Title + rank and Quote asset + Status */}
        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            minHeight: "1px",
            mb: "20px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            // rowGap: "20px",
            // backgroundColor: palette.grey[400],
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { sx: undefined, md: "352px" },
              height: "fit-content",
              // minHeight: "70px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              pb: "10px",
              borderBottom: `1px solid ${
                mode === "light" ? palette.divider : palette.grey[800]
              }`,
            }}
          >
            <CoinTitle wrapped={wrapped} titleRef={titleRef} />
          </Box>
          {/* Quote Asset + Status */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              minHeight: "80px",
              boxSizing: "border-box",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // backgroundColor: palette.grey[400],
              pt: "10px",
            }}
          >
            <CoinPropertyCard
              wrapped={width < "1835px" ? true : false}
              type="quoteAsset"
              sx={{ mr: "4px" }}
            >
              {coin ? coin.quoteAsset : ""}
            </CoinPropertyCard>
            <CoinPropertyCard type="status" sx={{ ml: "4px" }}>
              {coin ? (coin.active ? "Active" : "Inactive") : null}
            </CoinPropertyCard>
          </Box>
        </Box>

        {/* 24h data */}
        <Box
          sx={{
            width: "100%",
            height: "fit-content",
            // minHeight: "1px",
            // backgroundColor: palette.grey[500],
          }}
        >
          {/* "24h data: 28 August 2026" */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "fit-content",
              minHeight: "1px",
              boxSizing: "border-box",
              mb: "10px",
              // backgroundColor: palette.grey[600],
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.75rem",
                  textAlign: "center",
                  // mb: "6px",
                  color:
                    mode === "light"
                      ? palette.text.primary
                      : palette.common.white,
                }}
              >
                24h Data:
              </Typography>
              {coin && !coinLoading && !coinError ? (
                <Typography
                  sx={{ color: palette.primary.main, textAlign: "center" }}
                >
                  {formatDate(coin.summaryUpdatedAt)}
                </Typography>
              ) : null}

              {coinLoading && !coinError ? (
                <Box sx={{ width: "146px", height: "24px" }}>
                  <LoadingSkeleton sx={{ width: "100%" }} />
                </Box>
              ) : null}
            </Box>
            {/* <IconButton
              size="small"
              sx={{
                ml: "auto",
                mr: "16px",
                border: `1px solid ${palette.grey[400]}`,
                borderRadius: "4px",
              }}
            >
              <RefreshRoundedIcon sx={{ color: palette.text.primary }} />
            </IconButton> */}
          </Box>
          {/* last price, 24h high price,... */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "100%",
              // maxHeight: "474px",
              height: { xs: "auto", md: "calc(100vh - 475px)" },
              flexDirection: "column",
              gap: "10px",
              // minHeight: 0,
              overflow: "auto",
            }}
          >
            <PriceDataCard type="lastPrice24h" />
            <PriceDataCard type="highPrice24h" />
            <PriceDataCard type="lowPrice24h" />
            <PriceDataCard type="volume24h" />
            <PriceDataCard type="liquidity" />
          </Box>
        </Box>
      </Box>

      {/* OHLCV DATA - CHARTS, Technical Analysis and LSTM predictor microservices - right side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          minHeight: "1px",
          minWidth: 0,
          width: "100%",
          // height: { xs: "auto", md: "100%" },
          position: "relative",
          zIndex: 0,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "0px 30px 20px 30px",
            // flex: "1 1 auto",
            // flexGrow: 1,
            minWidth: 0,
            boxSizing: "border-box",
            overflow: "hidden",
            // backgroundColor: palette.grey[300],
          }}
        >
          {/* Chart controls */}
          <Box
            sx={{
              width: "100%",
              height: "32px",
              display: "flex",
              flexDirection: "row",
              // backgroundColor: palette.grey[400],
            }}
          >
            <ChartDateControlButton
              datePicker={dateRange}
              onClick={setRange}
              sx={{ ml: "0" }}
            >
              1D
            </ChartDateControlButton>
            <ChartDateControlButton datePicker={dateRange} onClick={setRange}>
              1W
            </ChartDateControlButton>
            <ChartDateControlButton datePicker={dateRange} onClick={setRange}>
              1M
            </ChartDateControlButton>
            <ChartDateControlButton datePicker={dateRange} onClick={setRange}>
              6M
            </ChartDateControlButton>
            <ChartDateControlButton datePicker={dateRange} onClick={setRange}>
              1Y
            </ChartDateControlButton>
            <ChartDateControlButton datePicker={dateRange} onClick={setRange}>
              YTD
            </ChartDateControlButton>
            <Box
              sx={{
                ml: "auto",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {coin && !coinLoading && !coinError ? (
                <Typography
                  variant="body1"
                  sx={{
                    pt: "5px",
                    pr: "15px",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.grey[500],
                  }}
                >
                  OHLCV - Data last updated: &nbsp;
                  {formatDate(coin?.summaryUpdatedAt)}
                </Typography>
              ) : null}

              {coinLoading && !coinError ? (
                <Box
                  sx={{
                    width: "337px",
                    height: "29px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LoadingSkeleton sx={{ width: "95%" }} />
                </Box>
              ) : null}

              <SquareButton
                onClick={() => {
                  getCsvByIdAsync(coin?.coinId);
                }}
                type="exportToCsvOhlcv"
              ></SquareButton>
            </Box>
          </Box>

          {/* CHARTS and Microservice data */}
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              height: { xs: "auto", md: "calc(100vh - 220px)" },
              overflow: { xs: "hidden", md: "auto" },
              mt: "10px",
              boxSizing: "border-box",
              // backgroundColor: palette.grey[300],
            }}
          >
            {/* OHLC Chart */}
            {/* <Box
              // ref={containerRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                minWidth: 0,
                overflow: "hidden",
                // width: "1362px",
                maxHeight: "375px",
                height: "375px",
                flexGrow: 1,
                mb: "8px",
                // mt: "20px",
                // boxSizing: "border-box",
                // border: `1px solid ${palette.grey[300]}`,
                // backgroundColor: palette.grey[300],
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "64px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  // backgroundColor: palette.grey[400],
                }}
              >
                <CardTitle
                  tooltipType={"ChartOHLC"}
                  formattedCoinData={formattedCoinOhlcvData}
                >
                  OHLC
                </CardTitle>
              </Box>
              {formattedCoinOhlcvData && !coinLoading && !coinError ? (
                <CandlestickChart
                  datePicker={dateRange}
                  height="300"
                  formattedCoinOhlcvData={formattedCoinOhlcvData}
                />
              ) : null}

              {coinLoading && !coinError ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    mt: "10px",
                    p: "0 10px 0 0",
                    boxSizing: "border-box",
                  }}
                >
                  <LoadingSkeleton sx={{ width: "100%" }} />
                </Box>
              ) : null}
            </Box> */}

            {/* Apex OHLC Chart */}
            <Box
              sx={{
                mt: "8px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                minWidth: 0,
                maxHeight: "370px",
                height: "370px",
                flexGrow: 1,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "64px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <CardTitle
                  tooltipType={"ChartOHLC"}
                  formattedCoinData={formattedCoinOhlcvData}
                >
                  OHLC
                </CardTitle>
              </Box>
              {formattedCoinOhlcvData.length > 0 &&
              !coinLoading &&
              !coinError ? (
                <ApexCandlestickChart
                  sx={{ pr: "49px" }}
                  datePicker={dateRange}
                  formattedCoinOhlcvData={formattedCoinOhlcvData}
                />
              ) : null}

              {coinLoading && !coinError ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    mt: "10px",
                    p: "0 10px 0 0",
                    boxSizing: "border-box",
                  }}
                >
                  <LoadingSkeleton sx={{ width: "100%" }} />
                </Box>
              ) : null}
            </Box>

            {/* Volume Chart */}
            <Box
              sx={{
                mt: "8px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxHeight: "370px",
                height: "370px",
                flexGrow: 1,
                // backgroundColor: palette.grey[500],
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "64px",
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "flex-start",
                  alignItems: "flex-start",
                  // backgroundColor: palette.grey[400],
                }}
              >
                <Box sx={{ height: "100%" }}>
                  <CardTitle
                    tooltipType={"ChartVolume"}
                    formattedCoinData={formattedCoinOhlcvData}
                  >
                    Volume
                  </CardTitle>
                </Box>
              </Box>
              {formattedCoinOhlcvData.length > 0 &&
              !coinLoading &&
              !coinError ? (
                <VolumeChart
                  datePicker={dateRange}
                  formattedCoinOhlcvData={formattedCoinOhlcvData}
                  sx={{ height: "100%", maxWidth: "100%", width: "1362px" }}
                />
              ) : null}

              {coinLoading && !coinError ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    mt: "10px",
                    p: "0 10px 0 0",
                    boxSizing: "border-box",
                  }}
                >
                  <LoadingSkeleton sx={{ width: "100%" }} />
                </Box>
              ) : null}
            </Box>

            {/* Microservices data container*/}
            <Box
              sx={{
                width: "100%",
                overflow: "hidden",
                pr: "10px",
                boxSizing: "border-box",
              }}
            >
              {/* Trend Indicators, Bollinger Bands and Volume Analysis */}
              <Grid container spacing={2} sx={{ height: "190px" }}>
                <Grid size={{ xs: 12, md: 4 }} item>
                  <MicroserviceDataCard
                    type="trendIndicators"
                    datePicker={dateRange}
                    sx={{ minHeight: "100%", pr: "10px" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} item>
                  <MicroserviceDataCard
                    type="bollingerBands"
                    datePicker={dateRange}
                    sx={{ minHeight: "100%", pr: "10px" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} item>
                  <MicroserviceDataCard
                    type="vma"
                    datePicker={dateRange}
                    sx={{ height: "100%", pr: "10px" }}
                  />
                </Grid>
              </Grid>

              {/*Oscilattors section - RSI, MACD, Stochastic Oscillator, ADX, CCI */}
              <Grid
                container
                size={{ xs: 12, md: 12 }}
                spacing={5.1}
                sx={{
                  mt: "45px",
                  height: "140px",
                  // backgroundColor: palette.grey[400],
                }}
              >
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} item>
                  <MicroserviceDataCard
                    type="rsiPanel"
                    datePicker={dateRange}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} item>
                  <MicroserviceDataCard
                    type="macdPanel"
                    datePicker={dateRange}
                    sx={{
                      minHeight: "100%",
                      pl: "10px",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} item>
                  <MicroserviceDataCard
                    type="stochasticPanel"
                    datePicker={dateRange}
                    sx={{ minHeight: "100%" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2.8 }} item>
                  <MicroserviceDataCard
                    type="adxPanel"
                    datePicker={dateRange}
                    sx={{ minHeight: "100%", pl: "8px" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }} item>
                  <MicroserviceDataCard
                    type="cciPanel"
                    datePicker={dateRange}
                    sx={{ minHeight: "100%" }}
                  />
                </Grid>
              </Grid>

              {/* Volume Analysis and Overall Technical Signal */}
              <Grid
                container
                size={{ xs: 12, md: 12 }}
                spacing={2}
                sx={{
                  mt: { xs: "32px", md: "60px" },
                  height: { xs: "auto", md: "190px" },
                }}
              >
                <Grid size={6} item>
                  <MicroserviceDataCard
                    type="overallSignal"
                    datePicker={dateRange}
                    sx={{ height: "100%" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} item>
                  <MicroserviceDataCard
                    type="lstmPricePrediction"
                    datePicker={dateRange}
                    sx={{ height: "100%" }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CoinDetails;
