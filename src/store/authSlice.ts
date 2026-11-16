import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadToken } from "../api";

// Авторизация — базовые возможности Redux Toolkit: slice с reducer и action.
// Запросы входа и выхода выполняет сам компонент, а в store попадает результат.
interface AuthState {
  token: string | null;
  userName: string | null;
}

const initialState: AuthState = {
  token: loadToken(), // после F5 токен берётся из Local Storage
  userName: null, // имя в Local Storage не храним: после F5 показываем «Создатель»
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<{ token: string; userName: string }>) {
      state.token = action.payload.token;
      state.userName = action.payload.userName;
    },
    loggedOut(state) {
      state.token = null;
      state.userName = null;
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
