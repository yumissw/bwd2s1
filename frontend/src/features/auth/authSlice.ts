import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginAPI, register as registerAPI} from "../../api/authService";
import { jwtDecode } from "jwt-decode";
import { PayloadAction } from "@reduxjs/toolkit";

import {
    getToken,
    setToken,
    removeToken,
    //getApiKey,
    //setApiKey,
    //removeApiKey,
  } from "../../utils/localStorageUtils";
interface User {
  name: string;
  surname?: string;
  patronymic?: string;
  email: string;
}

/*interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  message: string;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  message: "",
  isInitialized: false,
};*/

// Define the state interface
interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    isInitialized: boolean;
  }
  
  // Define the initial state
  const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: null,
    isInitialized: false,
  };


export const login = createAsyncThunk(
    "auth/login",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await loginAPI(email, password);
      // Assuming your API returns a token in the response
      const token = response.token; // Adjust according to your API response structure
      if (!token) {
        throw new Error("Token not found in API response");
      }
      setToken(token); // Store the token in local storage
      const decoded: any = jwtDecode(token);
      const user: User = {
        name: decoded.name,
        email: decoded.email,
      };
      return { token, user }; // Return the token and user object
    } catch (error: any) {
      removeToken(); // Clear the token in case of an error
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      ); // Reject with the error message
    }
  }
 /* "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const response = await login(email, password);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при входе");
    }
  },*/


);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      name,
      password,
    }: {
        email: string;
      name: string;
     
      
      password: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await registerAPI(
        email,
        name,
        password,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при регистрации");
    }
  },
);

/*const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    initializeAuthFromCookie: (state) => {
      const token = getTokenFromCookie();
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          state.token = token;
          state.user = {
            name: decoded.name,
            email: decoded.email,
          };
          state.isAuthenticated = true;
        } catch (error) {
          console.error("ошибка декодирования токена", error);
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      } else {
        state.isAuthenticated = false;
      }
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = `добро пожаловать, ${action.payload.name}`;
        document.cookie = `token=${action.payload.token}; path=/;`;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload as string;
      })

      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = "регистрация успешна";
        document.cookie = `token=${action.payload.token}; path=/;`;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.message = action.payload as string;
      });
  },
});*/

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      // Initialize auth state from localStorage
      initializeAuthFromLocalStorage: (state) => {
        const token = getToken();
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            const user: User = {
              name: decoded.name,
              email: decoded.email,
            };
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
          } catch (error) {
            console.error("ошибка декодирования токена", error);
            removeToken(); // Remove invalid token from localStorage
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
          }
        } else {
          state.isAuthenticated = false;
        }
        state.isInitialized = true;
      },
      // Logout action
      logout: (state) => {
        removeToken();
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(login.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.error = null;
        })
        .addCase(
          login.fulfilled,
          (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.isLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
          }
        )
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.error = action.payload as string;
        });
    },
  });

export const {initializeAuthFromLocalStorage, logout } = authSlice.actions;
export default authSlice.reducer;