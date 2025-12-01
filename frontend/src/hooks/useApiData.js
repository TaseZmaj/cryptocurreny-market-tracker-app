import { useState, useEffect } from "react";
/**
 * Custom Hook to fetch data from an API endpoint.
 * @param {string} url - The Spring Boot API endpoint URL.
 */

const useApiData = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Setup state for new operation
    setIsLoading(true);
    setError(null);

    //2. Define the async fetching function
    const fetchData = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          // Throw error 400 or 500
          throw new Error(`Http error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);
  // Return status and data
  return { data, isLoading, error };
};

export default useApiData;
