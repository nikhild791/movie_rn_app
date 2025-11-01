import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (typeof fetchFunction !== "function") {
      const e = new Error("fetchFunction must be a function");
      if (isMounted.current) setError(e);
      return Promise.reject(e);
    }

    try {
      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      const result = await fetchFunction();

      if (isMounted.current) setData(result as T);
      return result;
    } catch (err) {
      const e =
        err instanceof Error ? err : new Error("An unknown error occurred");
      if (isMounted.current) setError(e);
      // rethrow so callers can handle if they want
      throw e;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [fetchFunction]);

  const reset = useCallback(() => {
    if (!isMounted.current) return;
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      // run and swallow errors here (they're also exposed via `error` state)
      fetchData().catch((err) => {
        // Helpful debug log for development
        // eslint-disable-next-line no-console
        console.error("useFetch autoFetch error:", err);
      });
    }
    // fetchData is stable via useCallback
  }, [fetchData, autoFetch]);

  // Debug logging can be enabled during development as needed.
  // console.log({ data, loading, error });

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
