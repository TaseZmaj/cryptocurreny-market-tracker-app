import { Typography, Box, useColorScheme, useTheme } from "@mui/material";
import useCoins from "../../../hooks/useCoins.js";
import { useEffect, useState } from "react";
import Title from "../Title.jsx";
import { formatDatePickerSelection } from "../../../util/stringUtils.js";
import Indicator from "./Indicator.jsx";

function TechnicalAnalysisTab({ datePicker }) {
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
    <Box sx={{ maxWidth: "325px" }}>
      <Title includeDate={false} tooltipType="TrendIndicators">
        Trend Indicators (
        <span
          style={{
            color:
              mode === "light" ? palette.primary.main : palette.primary.light,
          }}
        >
          {datePicker}
        </span>
        )
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
          Trend Indicators data for {coin?.name} for <span></span>
          <b>{formatDatePickerSelection(datePicker)}</b>
          doesn't exist.
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
          <Indicator data={filteredTechnicalAnalysisData.last_candle?.sma_20}>
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
          <Indicator data={filteredTechnicalAnalysisData.last_candle?.ema_20}>
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
          <Indicator data={filteredTechnicalAnalysisData.last_candle?.wma_20}>
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
        </Box>
      ) : null}
    </Box>
  );
}

export default TechnicalAnalysisTab;
