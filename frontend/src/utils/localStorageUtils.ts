// src/utils/localStorageUtils.ts
const TOKEN_KEY = "authToken";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setApiKey = (apiKey: string) => {
  localStorage.setItem('apiKey', apiKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('apiKey');
};

export const removeApiKey = () => {
  localStorage.removeItem('apiKey'); // Функция для удаления API-ключа
};