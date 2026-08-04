import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook: useFetch
 * Generic reusable hook for asynchronous data fetching
 * @param {Function} fetchFn Async function returning a promise
 * @param {Array} dependencies Dependency array triggering automatic refetch
 */
export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executeFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      console.error('useFetch error:', err);
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return { data, loading, error, refetch: executeFetch };
};

export default useFetch;
