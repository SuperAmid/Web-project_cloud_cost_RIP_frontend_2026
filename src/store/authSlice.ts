import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Авторизация — базовые возможности Redux Toolkit: slice с reducer и action.
// Запросы входа и выхода выполняет сам компонент, а в store попадает результат.
interface AuthState {
  token: string | null;
  userName: string | null;
}

// После F5 store создаётся заново в состоянии гостя. JWT при этом остаётся
// в Local Storage (вкладка Application), но в store не загружается — нужен повторный вход.
const initialState: AuthState = {
  token: null,
  userName: null,
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
