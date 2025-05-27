export const getStorageItem = (
  key: string,
  defaultValue?: string
): string | undefined => {
  return (
    (localStorage.getItem(key) !== null && localStorage.getItem(key)) ||
    defaultValue
  );
};

export const setStorageItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const removeStorageItem = (key: string): void => {
  localStorage.removeItem(key);
};

// Lưu thông tin đăng nhập vào localStorage
export const setAuthStorage = (authData: API.TAuthTokenDto): void => {
  setStorageItem("accessToken", authData.accessToken || "");
};

// Lấy thông tin đăng nhập từ localStorage
export const getAuthStorage = (): API.TAuthTokenDto | null => {
  const accessToken = getStorageItem("accessToken");

  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: null,
    tokenType: "Bearer",
  };
};

export const removeAuthStorage = () => {
  removeStorageItem("accessToken");
};
