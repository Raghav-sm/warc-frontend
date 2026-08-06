export function debounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeoutMs: number,
): ((...args: Params) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Params) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = undefined;
      func(...args);
    }, timeoutMs);
  };

  debounced.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debounced;
}

export default debounce;
