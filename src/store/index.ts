import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice";
import draftReducer from "./draftSlice";
import feedReducer from "./feedSlice";
import providerRoutersReducer from "./providerRoutersSlice";

// Единое хранилище приложения (Redux Toolkit). Thunk middleware подключён по умолчанию.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    providerRouters: providerRoutersReducer,
    feed: feedReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Пользователь вошёл, если в store есть JWT
export const useIsAuth = () => useAppSelector((state) => state.auth.token !== null);
