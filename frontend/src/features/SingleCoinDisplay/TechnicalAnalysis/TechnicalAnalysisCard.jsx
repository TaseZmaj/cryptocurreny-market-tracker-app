import { Typography, Box, useColorScheme, useTheme } from "@mui/material";
import useCoins from "../../../hooks/useCoins.js";
import { useEffect, useState } from "react";
import Title from "../Title.jsx";
import { formatDatePickerSelection } from "../../../util/stringUtils.js";
import Indicator from "./Indicator.jsx";

function TechnicalAnalysisCard({ type, datePicker, sx }) {
  const {
    coin,
    coinTechnicalAnalysis,
    coinTechnicalAnalysisError,
    coinTechnicalAnalysisLoading,
  } = useCoins();

  const { mode } = useColorScheme();
  const { palette } = useTheme();

  const [filteredTechnicalAnalysisData, setFilteredTechnicalAnalysisData] =
    useState({});

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
    <Box sx={{ ...sx }}>
      <Title includeDate={false} tooltipType={type}>
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
      </Title>

      {/* If there is no data or there is an error */}
      {(!filteredTechnicalAnalysisData &&
        !coinTechnicalAnalysisLoading &&
        !coinTechnicalAnalysisError) ||
      filteredTechnicalAnalysisData.last_candle == null ||
      coinTechnicalAnalysisError ? (
        <Typography
          sx={{
            lineHeight: 1.1,
            fontSize: "1.1rem",
            mt: "10px",
            color: mode === "light" ? palette.error.light : palette.error.light,
          }}
        >
          {type === "trendIndicators" ? (
            <>
              Trend Indicators data for {coin?.name} for <span></span>
              <b>{formatDatePickerSelection(datePicker)}</b>
              doesn't exist.
            </>
          ) : null}
        </Typography>
      ) : null}

      {/* Trend indicators from the Technical Analysis */}
      {filteredTechnicalAnalysisData &&
      filteredTechnicalAnalysisData.last_candle &&
      coin &&
      !coinTechnicalAnalysisLoading &&
      !coinTechnicalAnalysisError ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            pt: "25px",
          }}
        >
          {type === "trendIndicators" ? (
            <>
              <Indicator
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
        </Box>
      ) : null}
    </Box>
  );
}

export default TechnicalAnalysisCard;
