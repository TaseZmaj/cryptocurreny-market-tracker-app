import {
  Box,
  Button,
  IconButton,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import useCoins from "../hooks/useCoins";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import LoadingTableCell from "../components/LoadingTableCell";
import RankTag from "../features/SingleCoinDisplay/RankTag.jsx";
import { getSymbolFontSize, getTitleFontSize } from "../util/stringUtils.js";
import CoinPropertyCard from "../features/SingleCoinDisplay/CoinPropertyCard.jsx";
import { formatDate } from "../util/stringUtils.js";
import PriceDataCard from "../features/SingleCoinDisplay/PriceDataCard.jsx";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CandlestickChart from "../features/SingleCoinDisplay/Charts/CandlestickChart.jsx";
import InfoIconTooltip from "../features/SingleCoinDisplay/InfoIconTooltip.jsx";
import ChartDateControlButton from "../features/SingleCoinDisplay/ChartDateControlButton.jsx";
import useWindowWidth from "../hooks/useWindowWidth.js";
import VolumeChart from "../features/SingleCoinDisplay/Charts/VolumeChart.jsx";
import SquareButton from "../components/SquareButton.jsx";
import { getCsvByIdAsync } from "../util/CoinsApi.js";
import SingleCoinErrorPage from "./SingleCoinErrorPage.jsx";

function CoinDetails() {
  const { palette } = useTheme();
  const { pathname } = useLocation();
  const { mode } = useColorScheme();
  const width = useWindowWidth();
  // const [invalidCoinUrl, setInvalidCoinUrl] = useState(null);

  //TODO: IMPLEMENT THE COIN NOT FOUND ERROR PAGE - I COULDNT GET IT TO WORK :[

  const {
    coin,
    coinError,
    coinLoading,
    getCoinById,
    getCoinTechnicalAnalysisById,
    getCoinLstmPredictionById,
  } = useCoins();

  const titleRef = useRef(null);
  const [wrapped, setWrapped] = useState(false);

  const coinIdFromPathname = pathname.split("/").at(-1);

  //TOP RADIO BUTTONS LOGIC --------------------------------------
  const [datePicker, setDatePicker] = useState("1M"); //1W, 1M, 6M, 1Y, YTD
  const [formattedCoinOhlcvData, setFormattedCoinOhlcvData] = useState([]);

  function handleFormatCoinOhlcvData() {
    if (!coin || !coin.dataOHLCV || coin.dataOHLCV.length === 0) {
      setFormattedCoinOhlcvData([]);
      return;
    }

    const DAYS_MAP = {
      "1W": 7,
      "1M": 31,
      "6M": 31 * 6,
      "1Y": 365,
      YTD: Infinity,
    };

    const limit = DAYS_MAP[datePicker];

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

  useEffect(() => {
    handleFormatCoinOhlcvData(datePicker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePicker, coin]);

  useEffect(() => {
    if (!coin || String(coin.coinId) !== String(coinIdFromPathname)) {
      getCoinById(coinIdFromPathname);
      getCoinTechnicalAnalysisById(coinIdFromPathname);
      getCoinLstmPredictionById(coinIdFromPathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinIdFromPathname]);

  //Checks
  //single-line? -> scrollHeight = lineHeight
  //multi-line -> scrollHeight = lineHeight
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    setWrapped(el.scrollHeight > lineHeight * 1.2);
  }, [coin?.name]);

  //Mandatory TODOS:
  //TODO: Add the Home screen error page
  //Other TODOS:
  //TODO: Fix the reset zoom button - KOCKASTO KOPCHE napravi i stavi go najlevo maybe?
  //TODO: Add mobile responsivity
  //TODO: Add animations

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      {/* 24H DATA - left side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "413px",
          height: "100%",
          // maxHeight: "745px",
          p: "0 30px 20px 30px",
          boxSizing: "border-box",
          // backgroundColor: palette.grey[300],
          borderRight: `1px solid ${
            mode === "light" ? palette.divider : palette.grey[900]
          }`,
        }}
      >
        {/* Title and rank */}
        {/* Logo - Bitcoin BTC #1 */}
        <Box
          sx={{
            width: "100%",
            height: "130px",
            minHeight: "119px",
            mb: "50px",
            display: "flex",
            flexDirection: "column",
            // backgroundColor: palette.grey[400],
          }}
        >
          {/* <Logo> Bitcoin BTC #1 */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "352px",
              height: "fit-content",
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
            {coin && !coinLoading && !coinError ? (
              <>
                <img
                  src={coin.coinIconUrl}
                  alt={coin.name}
                  width={56}
                  height={56}
                  style={{
                    borderRadius: "50%",
                    paddingRight: "12px",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: wrapped ? "center" : "baseline",
                    pt: "10px",
                    minWidth: 0,
                  }}
                >
                  <Typography
                    ref={titleRef}
                    variant="h3"
                    sx={{
                      color:
                        mode === "light"
                          ? palette.text.primary
                          : palette.common.white,
                      // whiteSpace: "nowrap",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // fontSize: "clamp(0.5rem, 3vw, 3rem)",
                      fontSize: getTitleFontSize(coin.name),
                      lineHeight: 1,
                      // letterSpacing: "-0.02em",
                    }}
                  >
                    {coin.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    // fontSize="1.5rem"
                    fontSize={getSymbolFontSize(coin.symbol)}
                    sx={{
                      whiteSpace: "nowrap",
                      color:
                        mode === "light"
                          ? palette.text.secondary
                          : palette.grey[200],
                      ml: "4px",
                      lineHeight: 1,
                    }}
                  >
                    {coin.symbol}
                  </Typography>
                  <RankTag
                    coin={coin}
                    sx={{
                      ml: "6px",
                      mt: "auto",
                      mb: wrapped ? "auto" : "0",
                    }}
                  />
                </Box>
              </>
            ) : null}

            {/* Loading state */}
            {coinLoading && !coinError ? <LoadingTableCell /> : null}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              minHeight: "80px",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              // backgroundColor: palette.grey[400],
              pt: "10px",
            }}
          >
            {coin && !coinLoading && !coinError ? (
              <>
                <CoinPropertyCard
                  wrapped={width < "1835px" ? true : false}
                  type="quoteAsset"
                  sx={{ mr: "4px" }}
                >
                  {coin.quoteAsset}
                </CoinPropertyCard>
                <CoinPropertyCard type="status" sx={{ ml: "4px" }}>
                  {coin.active ? "Active" : "Inactive"}
                </CoinPropertyCard>
              </>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            // backgroundColor: palette.grey[500],
          }}
        >
          {/* 24h Data:
              13th December 2025
          */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "70px",
              mb: "17px",
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
                variant="h4"
                sx={{
                  mb: "6px",
                  color:
                    mode === "light"
                      ? palette.text.primary
                      : palette.common.white,
                }}
              >
                24h Data:
              </Typography>
              {coin && !coinLoading && !coinError ? (
                <Typography sx={{ color: palette.primary.main }}>
                  {formatDate(coin.summaryUpdatedAt)}
                </Typography>
              ) : null}

              {coinLoading && !coinError ? null : null}
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
          {/* 24h data */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              // flexGrow: 1,
              width: "100%",
              // maxHeight: "474px",
              height: "calc(100vh - 475px)",
              flexDirection: "column",
              gap: "20px",
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
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "0px 30px 20px 30px",
            flexGrow: 1,
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
              datePicker={datePicker}
              setDatePicker={setDatePicker}
              sx={{ ml: "0" }}
            >
              1W
            </ChartDateControlButton>
            <ChartDateControlButton
              datePicker={datePicker}
              setDatePicker={setDatePicker}
            >
              1M
            </ChartDateControlButton>
            <ChartDateControlButton
              datePicker={datePicker}
              setDatePicker={setDatePicker}
            >
              6M
            </ChartDateControlButton>
            <ChartDateControlButton
              datePicker={datePicker}
              setDatePicker={setDatePicker}
            >
              1Y
            </ChartDateControlButton>
            <ChartDateControlButton
              datePicker={datePicker}
              setDatePicker={setDatePicker}
            >
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
              <Typography
                variant="body1"
                sx={{
                  pt: "5px",
                  pr: "15px",
                  color:
                    mode === "light" ? palette.text.primary : palette.grey[500],
                }}
              >
                OHLCV - Data last updated: &nbsp;
                {coin ? formatDate(coin?.summaryUpdatedAt) : ""}
              </Typography>
              <SquareButton
                onClick={() => {
                  getCsvByIdAsync(coin?.coinId);
                }}
                type="exportToCsvOhlcv"
              ></SquareButton>
            </Box>
          </Box>

          {/* CHARTS */}
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 220px)",
              overflow: "auto",
              mt: "10px",
              // backgroundColor: palette.grey[300],
            }}
          >
            {/* OHLC Chart */}
            <Box
              // ref={containerRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                // width: "1362px",
                maxHeight: "375px",
                height: "375px",
                flexGrow: 1,
                mb: "8px",
                // mt: "20px",
                // boxSizing: "border-box",
                // border: `1px solid ${palette.grey[300]}`,
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
                <Box sx={{ height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      OHLC
                    </Typography>
                    <InfoIconTooltip
                      placement="right"
                      type="ChartOHLC"
                      sx={{ top: "8px", left: "2px" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color:
                        mode === "light"
                          ? palette.text.primary
                          : palette.grey[200],
                    }}
                  >
                    {formattedCoinOhlcvData.length > 0 &&
                    !coinLoading &&
                    !coinError ? (
                      <>
                        {formatDate(formattedCoinOhlcvData.at(0)?.date)} –
                        {formatDate(formattedCoinOhlcvData.at(-1)?.date)}
                      </>
                    ) : null}
                  </Typography>
                </Box>
                {/* <Box
                  sx={{
                    ml: "auto",
                  }}
                >
                  <Typography>Refresh Zoom</Typography>
                </Box> */}
              </Box>
              {formattedCoinOhlcvData &&
              !coinLoading &&
              !coinError /*&&  size.width && size.height */ ? (
                <CandlestickChart
                  datePicker={datePicker}
                  width="1362"
                  height="300"
                  formattedCoinOhlcvData={formattedCoinOhlcvData}
                />
              ) : null}
            </Box>

            {/* Volume Chart */}
            <Box
              sx={{
                mt: "8px",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
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
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color:
                          mode === "light"
                            ? palette.text.primary
                            : palette.common.white,
                      }}
                    >
                      Volume
                    </Typography>
                    <InfoIconTooltip
                      placement="right"
                      type="ChartVolume"
                      sx={{ top: "8px", left: "2px" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color:
                        mode === "light"
                          ? palette.text.primary
                          : palette.grey[500],
                    }}
                  >
                    {formattedCoinOhlcvData.length > 0 &&
                    !coinLoading &&
                    !coinError ? (
                      <>
                        {formatDate(formattedCoinOhlcvData.at(0)?.date)} –{" "}
                        {formatDate(formattedCoinOhlcvData.at(-1)?.date)}
                      </>
                    ) : null}
                  </Typography>
                </Box>
              </Box>
              {formattedCoinOhlcvData.length > 0 &&
              !coinLoading &&
              !coinError ? (
                <VolumeChart
                  formattedCoinOhlcvData={formattedCoinOhlcvData}
                  sx={{ height: "100%", width: "1362px" }}
                />
              ) : null}
            </Box>

            {/* Microservices data container*/}
            <Box
              sx={{
                width: "100%",
                height: "400px",
                backgroundColor: "lightgray",
              }}
            ></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CoinDetails;
