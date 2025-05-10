import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

type Gender = "male" | "female" | "other" | "not specified";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (
  email: string,
  name: string,
  lastName: string,
  firstName: string,
  patronymic: string,
  gender: Gender,
  dateOfBirth: Date,
  password: string,
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      name,
      lastName,
  firstName,
  patronymic,
  gender,
  dateOfBirth,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};
