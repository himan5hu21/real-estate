import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Convert expiration time to milliseconds
  } catch (error) {
    console.error(error);
    return true;
  }
};
