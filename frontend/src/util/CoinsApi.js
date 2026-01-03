export async function fetchAllCoinsAsync() {
  const apiEndpoint = import.meta.env.VITE_APP_API_URL;

  const res = await fetch(apiEndpoint);
  if (!res.ok) {
    throw new Error(`Failed to fetch coins from API - url: ${apiEndpoint}`);
  }
  return res.json();
}

export async function fetchCoinByIdAsync(coinId) {
  const apiEndpoint24hData = import.meta.env.VITE_APP_API_URL + `/${coinId}`;
  const apiEndpointOHLCVData =
    import.meta.env.VITE_APP_API_URL + `/${coinId}/history`;

  const [res24h, resOHLCV] = await Promise.all([
    fetch(apiEndpoint24hData),
    fetch(apiEndpointOHLCVData),
  ]);

  if (!res24h.ok) {
    throw new Error(
      `Failed to fetch coin with id:  ${coinId} from API - url: ${apiEndpoint24hData}`
    );
  }

  if (!resOHLCV.ok) {
    throw new Error(
      `Failed to fetch coin with id:  ${coinId} from API - url: ${apiEndpointOHLCVData}`
    );
  }

  let data24h;
  try {
    data24h = await res24h.json();
  } catch {
    throw new Error(
      `Failed to parse JSON from 24h API response for coin ${coinId}`
    );
  }

  let dataOHLCV = null;
  if (resOHLCV.ok) {
    try {
      dataOHLCV = await resOHLCV.json();
    } catch {
      throw new Error(
        `Failed to parse OHLCV JSON for coin ${coinId}, setting null`
      );
    }
  }

  // const [data24h, dataOHLCV] = await Promise.all([
  //   res24h.json(),
  //   resOHLCV.json(),
  // ]);

  return { ...data24h, dataOHLCV: dataOHLCV };
}

export async function getCsvAll24hDataAsync() {
  //All 24h data's - .csv
  const apiEndpoint = import.meta.env.VITE_EXPORT_API_URL + "/coins";

  const res = await fetch(apiEndpoint);
  if (!res.ok) {
    throw new Error(`Failed to get .csv from API - url: ${apiEndpoint}`);
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const filename = "coins24hData.csv";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function getCsvByIdAsync(coinId) {
  //OHLCV data for coin - .csv
  const apiEndpoint =
    import.meta.env.VITE_EXPORT_API_URL + `/coins/${coinId}/history`;

  const res = await fetch(apiEndpoint);
  if (!res.ok) {
    throw new Error(`Failed to get .csv from API - url: ${apiEndpoint}`);
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const filename = `${coinId}OhlcvData.csv`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchCoinTechnicalAnalysisByIdAsync(coinId) {
  const apiEndpoint =
    import.meta.env.VITE_MICROSERVICES_API_URL +
    `/${coinId}/technical-analysis`;

  const res = await fetch(apiEndpoint);
  if (!res.ok) {
    throw new Error(
      `Failed to get the Technical Analasys for ${coinId} from API - url: ${apiEndpoint}`
    );
  }

  return res.json();
}

export async function fetchCoinLSTMPredictionByIdAsync(coinId) {
  const apiEndpoint =
    import.meta.env.VITE_MICROSERVICES_API_URL + `/${coinId}/lstm-prediction`;

  const res = await fetch(apiEndpoint);
  if (!res.ok) {
    throw new Error(
      `Failed to get the LSTM Prediction for ${coinId} from API - url: ${apiEndpoint}`
    );
  }

  return res.json();
}
