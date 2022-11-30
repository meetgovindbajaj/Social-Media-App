import { useEffect, useState } from "react";

const useDebounce = (value) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue((val) => (val = value));
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
