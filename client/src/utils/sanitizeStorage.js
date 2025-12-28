export const sanitizeStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    if (value === "undefined" || value === undefined || value === null) {
      console.warn("🧹 Removing invalid storage key:", key);
      localStorage.removeItem(key);
      continue;
    }

    // Only parse if it looks like JSON (starts with { or [)
    if (/^\s*[\{\[]/.test(value)) {
      try {
        JSON.parse(value);
      } catch {
        console.warn("🧹 Removing corrupted storage key:", key);
        localStorage.removeItem(key);
      }
    }
  }
};
