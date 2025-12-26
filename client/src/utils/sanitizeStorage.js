export const sanitizeStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    if (value === "undefined" || value === undefined) {
      console.warn("🧹 Removing invalid storage key:", key);
      localStorage.removeItem(key);
      continue;
    }

    try {
      JSON.parse(value);
    } catch {
      console.warn("🧹 Removing corrupted storage key:", key);
      localStorage.removeItem(key);
    }
  }
};
