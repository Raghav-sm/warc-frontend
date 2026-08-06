import { useEffect, useMemo, useRef } from "react";

import { debounce } from "@/utils/debounce";

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): (...args: Args) => void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(
    () =>
      debounce((...args: Args) => {
        callbackRef.current(...args);
      }, delayMs),
    [delayMs],
  );

  useEffect(() => () => debouncedCallback.cancel(), [debouncedCallback]);

  return debouncedCallback;
}
