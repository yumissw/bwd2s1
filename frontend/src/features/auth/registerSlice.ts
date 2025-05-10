import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { register as registerAPI} from "../../api/authService";
type Gender = "male" | "female" | "other" | "not specified";
interface RegisterPayload {
  name: string;
  email: string;
  lastName: string,
  firstName: string,
  patronymic: string,
  gender: Gender,
  dateOfBirth: Date,
  password: string;
}

interface RegisterState {
  isLoading: boolean;
  isError: boolean;
  successMessage: string | null;
}

const initialState: RegisterState = {
  isLoading: false,
  isError: false,
  successMessage: null,
};

export const register = createAsyncThunk(
  "register/user",
  async (data: RegisterPayload, thunkAPI) => {
    try {
      const response = await registerAPI(
        data.email,
        data.name,
        data.lastName,
        data.firstName,
        data.patronymic,
        data.gender,
        data.dateOfBirth,
        data.password,
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("ошибка при регистрации");
    }
  },
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.successMessage = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = `пользователь успешно зарегистрирован`;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;