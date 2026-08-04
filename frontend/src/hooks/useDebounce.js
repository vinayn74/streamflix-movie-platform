import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 * Delays updating a value until after specified delay ms have elapsed
 * @param {any} value The input value to debounce
 * @param {number} delay Milliseconds delay (default 300ms)
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
