// Shared browser storage adapter. Writes notify this tab and native storage events
// synchronize other tabs. Storage failures propagate so forms can offer a retry.
export function createBrowserStore(key: string) {
  const eventName = `${key}:changed`;
  return {
    getSnapshot(): string | null {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    getServerSnapshot(): undefined {
      return undefined;
    },
    write(value: string | null) {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
      window.dispatchEvent(new Event(eventName));
    },
    subscribe(onChange: () => void) {
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) onChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(eventName, onChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(eventName, onChange);
      };
    },
  };
}
