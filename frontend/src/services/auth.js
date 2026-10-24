import { api } from "./api";

export async function registerUser(name, email, password) {
  return api.post("/api/auth/register", {
    name,
    email,
    password,
  });
}

export async function loginUser(email, password) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  const token = response?.data?.accessToken;

  if (!token) {
    throw new Error("Login successful but token was not received");
  }

  setAuthToken(token);

  return response;
}

export async function getCurrentUser() {
  return api.get("/api/auth/me");
}

export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function removeAuthToken() {
  localStorage.removeItem("authToken");
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}