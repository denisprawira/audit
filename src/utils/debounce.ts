function debounce<T>(callback: (...args: T[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: T[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
export default debounce;
