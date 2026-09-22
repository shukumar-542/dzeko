// redux-persist er built-in storage module conditional require diye load
// korle Next.js bundler (webpack/Turbopack) e majhe majhe broken object
// return kore ("storage.setItem is not a function"). Tai nijer simple,
// bundler-safe localStorage wrapper likha holo — ekhane kono ambiguity nai.

const storage = {
  getItem(key: string): Promise<string | null> {
    if (typeof window === "undefined") return Promise.resolve(null);
    try {
      return Promise.resolve(window.localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem(key: string, value: string): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // localStorage full ba blocked (private mode) hole silently ignore
    }
    return Promise.resolve();
  },
  removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return Promise.resolve();
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return Promise.resolve();
  },
};

export default storage;