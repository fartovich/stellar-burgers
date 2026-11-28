import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isChecked: boolean;
  isLoading: boolean;
  error: string | null;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
};

const initialState: UserState = {
  user: null,
  isChecked: false,
  isLoading: false,
  error: null,
  loginError: null,
  registerError: null,
  updateUserError: null,
};

const saveTokens = (data: { accessToken: string; refreshToken: string }): void => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const checkUser = createAsyncThunk<
  TUser | null,
  void,
  { state: { user: UserState } }
>(
  'user/check',
  async () => {
    if (!getCookie('accessToken') && !localStorage.getItem('refreshToken')) return null;
    try {
      if (!getCookie('accessToken')) await refreshToken();
      const response = await getUserApi();
      if (!response.success || !response.user)
        throw new Error('Не удалось получить данные пользователя');
      return response.user;
    } catch (error) {
      clearTokens();
      throw error;
    }
  },
  {
    condition: (_, { getState }) =>
      !getState().user.isChecked && !getState().user.isLoading,
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response);
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    if (!response.success || !response.user)
      throw new Error('Не удалось сохранить данные');
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  if (!response.success) throw new Error('Не удалось выйти из аккаунта');
  clearTokens();
});

export const forgotPassword = createAsyncThunk('user/forgot', forgotPasswordApi);
export const resetPassword = createAsyncThunk('user/reset', resetPasswordApi);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(checkUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUser.rejected, (state) => {
        state.user = null;
        state.isChecked = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginError = null;
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginError = action.error.message ?? 'Ошибка запроса';
        state.isLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerError = null;
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerError = action.error.message ?? 'Ошибка запроса';
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserError = null;
        state.isLoading = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.error.message ?? 'Ошибка запроса';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(loginUser.fulfilled, registerUser.fulfilled, updateUser.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(logoutUser.pending, forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(logoutUser.rejected, forgotPassword.rejected, resetPassword.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Ошибка запроса';
        }
      ),
});
