const TOKEN_LOCALSTORAGE_KEY = "token";
export const tokenStorage = {
  getToken: () => {
    let parsed;
    const token = window.localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
    if (token !== null) {
      parsed = JSON.parse(token);
      return parsed;
    } else {
      return null;
    }
  },
  setToken: (token: string) =>
    window.localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY),
};