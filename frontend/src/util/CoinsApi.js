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
