// Node.js 25 exposes a broken globalThis.localStorage (getItem/setItem are undefined)
// unless --localstorage-file is passed. Stub it so Next.js dev overlay doesn't crash.
export async function register() {
  if (typeof window === "undefined" && typeof globalThis.localStorage !== "undefined") {
    const ls = globalThis.localStorage;
    if (typeof ls.getItem !== "function") {
      const store = new Map<string, string>();
      globalThis.localStorage = {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => { store.set(k, String(v)); },
        removeItem: (k: string) => { store.delete(k); },
        clear: () => { store.clear(); },
        get length() { return store.size; },
        key: (i: number) => [...store.keys()][i] ?? null,
      } as Storage;
    }
  }
}
