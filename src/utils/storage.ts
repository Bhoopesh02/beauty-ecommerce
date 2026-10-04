export const STORAGE_KEYS = {
  PRODUCTS: "derrume_products",
  USERS: "derrume_users",
  SESSION: "derrume_session",
  CART: "derrume_cart",
  WISHLIST: "derrume_wishlist",
  ORDERS: "derrume_orders",
  CHECKOUT: "derrume_checkout",
};

export const storage = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return fallback;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e);
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn("Error clearing localStorage:", e);
    }
  }
};

export const sessionStorageUtils = {
  get: <T>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.sessionStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading sessionStorage key "${key}":`, e);
      return fallback;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error setting sessionStorage key "${key}":`, e);
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing sessionStorage key "${key}":`, e);
    }
  }
};
