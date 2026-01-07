import {
  Typography,
  Box,
  useColorScheme,
  useTheme,
  Button,
} from "@mui/material";
import useCoins from "../../../hooks/useCoins.js";
import { useEffect, useState } from "react";
import Title from "../Title.jsx";
import { formatDatePickerSelection } from "../../../util/stringUtils.js";
import Indicator from "./Indicator.jsx";
import RsiProgressBar from "./RsiProgressBar.jsx";

const technicalAnalysisTypes = [
  "trendIndicators",
  "bollingerBands",
  "vma",
  "rsiPanel",
  "macdPanel",
  "stochasticPanel",
  "adxPanel",
  "cciPanel",
  "overallSignal",
];

function MicroserviceDataCard({ type, datePicker, sx }) {
  const {
    coin,
    coinTechnicalAnalysis,
    coinTechnicalAnalysisError,
    coinTechnicalAnalysisLoading,
    coinLstmPredictionLoading,
    coinLstmPrediction,
    coinLstmPredictionError,
  } = useCoins();

  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const [filteredTechnicalAnalysisData, setFilteredTechnicalAnalysisData] =
    useState({});

  //If the Component uses Technical Analysis data
  const analysisData = technicalAnalysisTypes.includes(type)
    ? filteredTechnicalAnalysisData?.last_candle
    : null;

  //If the Component uses Lstm Prediction data
  const lstmData =
    type === "lstmPricePrediction" && coinLstmPrediction !== null
      ? coinLstmPrediction
      : null;

  // ================== BOLLINGER BANDS position calucaltion logic ================
  const price = coin?.lastPrice;
  const lowerBand = analysisData?.bb_lower;
  const upperBand = analysisData?.bb_upper;
  const position =
    price != null && lowerBand != null && upperBand != null
      ? (price - lowerBand) / (upperBand - lowerBand)
      : null;
  // =============================================================================

  //==================== MACD and MACD SIGNAL bullish/bearish ui calculations ====
  const macd = analysisData?.macd;
  const macdSignal = analysisData?.macd_signal;
  const macdStatus =
    macd != null && macdSignal != null
      ? macd === macdSignal
        ? "No crossover"
        : macd > macdSignal
        ? "Bullish crossover"
        : "Bearish crossover"
      : null;

  const macdStatusColorMap = macdStatus
    ? {
        "No crossover":
          mode === "light" ? palette.grey[500] : palette.grey[400],
        "Bullish crossover": palette.success.main,
        "Bearish crossover": palette.error.main,
      }
    : null;
  //=============================================================================

  // ================ STOCHASTIC MOMENTUM bullish/bearish ui calculation =========
  const stochK = analysisData?.stoch_k;
  const stochD = analysisData?.stoch_d;
  const stochStatus =
    stochK !== null && stochD !== null && stochK === stochD
      ? "Neutral"
      : stochK > stochD
      ? "Bullish Momentum"
      : stochK < stochD
      ? "Bearish Momentum"
      : null;

  const stochStatusColorMap = stochStatus
    ? {
        Neutral: mode === "light" ? palette.grey[500] : palette.grey[400],
        "Bullish Momentum": palette.success.main,
        "Bearish Momentum": palette.error.main,
      }
    : null;
  //=============================================================================

  //===================== ADX ui calculations ===================================
  const adx = analysisData?.adx;
  let adxStatus;
  if (type === "adxPanel" && adx !== null) {
    switch (true) {
      case adx < 20:
        adxStatus = "Weak";
        break;
      case adx >= 20 && adx < 25:
        adxStatus = "Emerging Trend";
        break;
      case adx >= 25 && adx < 40:
        adxStatus = "Strong Trend";
        break;
      default:
        adxStatus = "Very Strong Trend";
        break;
    }
  }

  const adxStatusColorMap =
    type === "adxPanel" && adx != null
      ? {
          Weak: palette.error.light,
          "Emerging Trend": palette.warning.light,
          "Strong Trend": palette.success.light,
          "Very Strong Trend": palette.success.main,
        }
      : null;

  //=============================================================================

  //===================== CCI ui calculations ===================================
  const cci = analysisData?.cci;
  let cciStatus;

  if (type === "cciPanel" && cci !== null) {
    switch (true) {
      case cci > 100:
        cciStatus = "Bullish";
        break;
      case cci < -100:
        cciStatus = "Bearish";
        break;
      default:
        cciStatus = "Neutral";
        break;
    }
  }

  const cciStatusColorMap =
    type === "cciPanel" && cci != null
      ? {
          Bullish: palette.error.light,
          Bearish: palette.success.main,
          Neutral: mode === "light" ? palette.grey[500] : palette.grey[400],
        }
      : null;
  //=============================================================================

  //==================== VOLUME ANALYSIS ui calculations =======================
  const vma = type === "vma" ? analysisData?.vma_20 : null;
  const volume = type === "vma" ? coin?.volume24h : null;

  let vmaStatus;
  if (type === "vma" && vma !== null && volume !== null) {
    const volumeRatio = volume / vma;

    switch (true) {
      case volumeRatio >= 1.5:
        vmaStatus = { vmaMsg: "Very High", inBrackets: "Strong confirmation" };
        break;
      case volumeRatio >= 1.2 && volumeRatio < 1.5:
        vmaStatus = {
          vmaMsg: "Above Average",
          inBrackets: "Good confirmation",
        };
        break;
      case volumeRatio >= 0.8 && volumeRatio < 1.2:
        vmaStatus = { vmaMsg: "Average", inBrackets: "Neutral confirmation" };
        break;
      case volumeRatio >= 0.5 && volumeRatio < 0.8:
        vmaStatus = {
          vmaMsg: "Below Average",
          inBrackets: "Weak confirmation",
        };
        break;
      default:
        vmaStatus = { vmaMsg: "Very Low", inBrackets: "No confirmation" };
        break;
    }
  }

  const vmaStatusColorMap =
    type === "vma"
      ? {
          "Very High": palette.success.main,
          "Above Average": palette.success.light,
          Average: mode === "light" ? palette.grey[500] : palette.grey[400],
          "Below Average": palette.warning.light,
          "Very Low": palette.error.light,
        }
      : null;
  //=============================================================================

  //============================ OVERALL SIGNAL ui logic ========================
  const signal =
    type === "overallSignal" ? filteredTechnicalAnalysisData?.signal : null;

  const signalColorMap =
    type === "overallSignal"
      ? {
          BUY: palette.success.light,
          SELL: palette.error.light,
          HOLD: mode === "light" ? palette.grey[500] : palette.grey[400],
        }
      : null;

  //=============================================================================

  function handleFilterTechnicalAnalysisByDatePicker(datePicker) {
    const key = datePicker.toLowerCase();
    const filteredTechnicalAnalysis = coinTechnicalAnalysis.timeframes[key];

    setFilteredTechnicalAnalysisData(filteredTechnicalAnalysis);
  }

  useEffect(() => {
    if (!coinTechnicalAnalysis.timeframes || !datePicker) {
      return;
    }
    handleFilterTechnicalAnalysisByDatePicker(datePicker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePicker, coinTechnicalAnalysis]);

  return (
    <Box
      sx={{
        height: "fit-content",
        // border: "1px solid lightgray",
        boxSizing: "border-box",
        ...sx,
      }}
    >
      <Title includeDate={false} tooltipType={type}>
        {technicalAnalysisTypes.includes(type) ? (
          <>
            {type === "trendIndicators" ? (
              <>
                Trend Indicators (
                <span
                  style={{
                    color:
                      mode === "light"
                        ? palette.primary.main
                        : palette.primary.light,
                  }}
                >
                  {datePicker}
                </span>
                )
              </>
            ) : null}
            {type === "bollingerBands" ? (
              <>
                Bollinger Bands (
                <span
                  style={{
                    color:
                      mode === "light"
                        ? palette.primary.main
                        : palette.primary.light,
                  }}
                >
                  {datePicker}
                </span>
                )
              </>
            ) : null}
            {type === "rsiPanel" ? (
              <>
                RSI (
                <span
                  style={{
                    color:
                      mode === "light"
                        ? palette.primary.main
                        : palette.primary.light,
                  }}
                >
                  14
                </span>
                )
              </>
            ) : null}
            {type === "macdPanel" ? "MACD" : null}
            {type === "stochasticPanel" ? "Stochastic Oscillator" : null}
            {type === "cciPanel" ? "CCI" : null}
            {type === "adxPanel" ? "ADX" : null}
            {type === "vma" ? "Volume Analysis" : null}
            {type === "overallSignal" ? (
              <>
                Overall Technical Signal (
                <span
                  style={{
                    color:
                      mode === "light"
                        ? palette.primary.main
                        : palette.primary.light,
                  }}
                >
                  {datePicker}
                </span>
                )
              </>
            ) : null}
          </>
        ) : null}
        {type === "lstmPricePrediction" ? "Lstm Price Prediction" : null}
      </Title>

      <Typography
        sx={{
          lineHeight: 1.1,
          fontSize: "1.1rem",
          mt: "10px",
          color: mode === "light" ? palette.error.light : palette.error.light,
        }}
      >
        {/* If there is no data or there is an error */}
        {(technicalAnalysisTypes.includes(type) &&
          !analysisData &&
          analysisData?.last_candle !== null &&
          !coinTechnicalAnalysisLoading &&
          !coinTechnicalAnalysisError) ||
        coinTechnicalAnalysisError ? (
          <>
            {type !== "overallSignal" ? (
              <>
                {type === "trendIndicators" ? "Trend Indicators " : null}
                {type === "bollingerBands" ? "Bollinger Bands " : null}
                {type === "rsiPanel" ? "RSI " : null}
                {type === "macdPanel" ? "MACD " : null}
                {type === "stochasticPanel" ? "Stochastic Oscillator " : null}
                {type === "cciPanel" ? "CCI " : null}
                {type === "adxPanel" ? "ADX " : null}
                {type === "vma" ? "Volume Analysis " : null}
                data for {coin?.name} for <span></span>
                <b>{formatDatePickerSelection(datePicker)}</b>
                doesn't exist.
              </>
            ) : (
              `Overall signal data for ${formatDatePickerSelection(
                datePicker
              )} is not available.`
            )}
          </>
        ) : null}
        {(type === "lstmPricePrediction" &&
          !lstmData &&
          !coinLstmPredictionLoading &&
          !coinLstmPredictionError) ||
        coinLstmPredictionError
          ? `Lstm Prediction Data for ${coin?.name} doesn't exist`
          : null}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          pt:
            type === "bollingerBands" ||
            type === "trendIndicators" ||
            type === "vma" ||
            type === "overallSignal" ||
            type === "lstmPricePrediction"
              ? "25px"
              : "10px",
        }}
      >
        {/* Technical Analysis microservice data */}
        {technicalAnalysisTypes.includes(type) &&
        analysisData &&
        analysisData?.last_candle !== null &&
        !coinTechnicalAnalysisLoading &&
        !coinTechnicalAnalysisError &&
        coin ? (
          <>
            {type === "trendIndicators" ? (
              <>
                <Indicator
                  type="trendIndicators"
                  data={filteredTechnicalAnalysisData.last_candle?.sma_20}
                >
                  SMA(
                  <span
                    style={{
                      color:
                        mode === "light"
                          ? palette.primary.main
                          : palette.primary.light,
                    }}
                  >
                    20
                  </span>
                  ):
                </Indicator>
                <Indicator
                  type="trendIndicators"
                  data={filteredTechnicalAnalysisData.last_candle?.ema_20}
                >
                  EMA(
                  <span
                    style={{
                      color:
                        mode === "light"
                          ? palette.primary.main
                          : palette.primary.light,
                    }}
                  >
                    20
                  </span>
                  ):
                </Indicator>
                <Indicator
                  type="trendIndicators"
                  data={filteredTechnicalAnalysisData.last_candle?.wma_20}
                >
                  WMA(
                  <span
                    style={{
                      color:
                        mode === "light"
                          ? palette.primary.main
                          : palette.primary.light,
                    }}
                  >
                    20
                  </span>
                  ):
                </Indicator>
              </>
            ) : null}
            {type === "bollingerBands" ? (
              <>
                <Indicator
                  data={filteredTechnicalAnalysisData.last_candle?.bb_upper}
                >
                  Upper:
                </Indicator>
                <Indicator
                  data={filteredTechnicalAnalysisData.last_candle?.bb_middle}
                >
                  Middle:
                </Indicator>
                <Indicator
                  data={filteredTechnicalAnalysisData.last_candle?.bb_lower}
                >
                  Lower:
                </Indicator>
                {position != null ? (
                  <Typography
                    sx={{
                      paddingTop: "5px",
                      color:
                        mode === "light"
                          ? palette.text.primary
                          : palette.common.white,
                    }}
                    fontSize="1.1rem"
                  >
                    <b>Position: </b>
                    {position < 0.2 ? (
                      <>
                        Near Lower Band (
                        <span
                          style={{
                            fontWeight: "bold",
                            color: palette.success.main,
                          }}
                        >
                          Bullish bias
                        </span>
                        )
                      </>
                    ) : null}
                    {position >= 0.2 && position < 0.4 ? (
                      <>
                        Below Middle (
                        <span
                          style={{
                            fontWeight: "bold",
                            color: palette.success.light,
                          }}
                        >
                          Slightly bullish
                        </span>
                        )
                      </>
                    ) : null}
                    {position >= 0.4 && position < 0.6 ? (
                      <>
                        Near Middle (
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              mode === "light"
                                ? palette.grey[700]
                                : palette.grey[500],
                          }}
                        >
                          Neutral
                        </span>
                        )
                      </>
                    ) : null}
                    {position >= 0.6 && position < 0.8 ? (
                      <>
                        Above Middle (
                        <span
                          style={{
                            fontWeight: "bold",
                            color: palette.error.light,
                          }}
                        >
                          Caution
                        </span>
                        )
                      </>
                    ) : null}
                    {position > 0.8 ? (
                      <>
                        Near Upper Band (
                        <span
                          style={{
                            fontWeight: "bold",
                            color: palette.error.main,
                          }}
                        >
                          Bearish bias
                        </span>
                        )
                      </>
                    ) : null}
                  </Typography>
                ) : null}
              </>
            ) : null}
            {type === "rsiPanel" ? (
              <RsiProgressBar value={analysisData?.rsi} />
            ) : null}
            {type === "macdPanel" ? (
              <>
                <Indicator
                  isCurrency={false}
                  data={analysisData?.macd.toFixed(2)}
                >
                  MACD:
                </Indicator>
                <Indicator
                  isCurrency={false}
                  data={analysisData?.macd_signal.toFixed(2)}
                >
                  Signal:
                </Indicator>
                <Typography
                  sx={{
                    pt: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  Signal: <span></span>
                  <span
                    style={{
                      color: macdStatusColorMap[macdStatus],
                    }}
                  >
                    {macdStatus}
                  </span>
                </Typography>
              </>
            ) : null}
            {type === "stochasticPanel" ? (
              <>
                <Indicator
                  isCurrency={false}
                  data={analysisData?.stoch_k.toFixed(2)}
                >
                  %K:
                </Indicator>
                <Indicator
                  isCurrency={false}
                  data={analysisData?.stoch_d.toFixed(2)}
                >
                  %D:
                </Indicator>
                <Typography
                  sx={{
                    pt: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  Signal: <span></span>
                  <span style={{ color: stochStatusColorMap[stochStatus] }}>
                    {stochStatus}
                  </span>
                </Typography>
              </>
            ) : null}
            {type === "adxPanel" ? (
              <Box
                sx={{
                  mt: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Indicator
                  isCurrency={false}
                  data={analysisData?.adx.toFixed(2)}
                >
                  ADX:
                </Indicator>
                <Typography
                  sx={{
                    // pt: "45px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  Trend Strength: <span></span>
                  <span style={{ color: adxStatusColorMap[adxStatus] }}>
                    {adxStatus}
                  </span>
                </Typography>
              </Box>
            ) : null}
            {type === "cciPanel" ? (
              <Box
                sx={{
                  mt: "15px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Indicator
                  isCurrency={false}
                  data={analysisData?.cci.toFixed(2)}
                >
                  CCI:
                </Indicator>
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  Status: <span></span>
                  <span style={{ color: cciStatusColorMap[cciStatus] }}>
                    {cciStatus}
                  </span>
                </Typography>
              </Box>
            ) : null}
            {type === "vma" ? (
              <>
                <Indicator data={coin?.volume24h}>Current Volume:</Indicator>
                <Indicator data={analysisData?.vma_20}>
                  Average Volume (
                  <span style={{ color: palette.primary.main }}>20</span>
                  ):
                </Indicator>
                <Typography
                  sx={{
                    pt: "10px",
                    fontSize: "1.1rem",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Status:</span>{" "}
                  <span></span>
                  {vmaStatus.vmaMsg} <span></span>(
                  <span
                    style={{
                      fontWeight: "bold",
                      color: vmaStatusColorMap[vmaStatus.vmaMsg],
                    }}
                  >
                    {vmaStatus.inBrackets}
                  </span>
                  )
                </Typography>
              </>
            ) : null}
            {type === "overallSignal" ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    pr: "4px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color:
                      mode === "light"
                        ? palette.text.primary
                        : palette.common.white,
                  }}
                >
                  Overall Signal:
                </Typography>
                <Box
                  sx={{
                    borderRadius: "6px",
                    backgroundColor: signalColorMap[signal],
                    boxSizing: "border-box",
                    p: "5px 10px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.16rem",
                      fontWeight: "bold",
                      color: palette.common.white,
                    }}
                  >
                    {signal}
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </>
        ) : null}
        {type === "lstmPricePrediction" ? (
          <>
            <Indicator
              sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              data={price}
            >
              Current Price:
            </Indicator>
            <Indicator
              sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              data={lstmData.prediction}
            >
              Predicted Price:
            </Indicator>
          </>
        ) : null}
      </Box>
    </Box>
  );
}

export default MicroserviceDataCard;
