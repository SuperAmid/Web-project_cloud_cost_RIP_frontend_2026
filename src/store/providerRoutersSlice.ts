import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { errorMessage, isBackendDown } from "../api/errors";
import { getProviderRoutersMock } from "../modules/providerRoutersApi";
import { ProviderRouter, toProviderRouter } from "../modules/types";
import { loggedOut } from "./authSlice";

// Плитка маршрутизаторов. Запросы к API выполняются в async thunk,
// компонент только вызывает dispatch(action) и читает данные через useSelector.
interface ProviderRoutersState {
  sliderValue: number; // значение слайдера — сохраняется при переходе между страницами
  minBandwidthMbps: number; // применённый фильтр
  items: ProviderRouter[];
  loading: boolean;
  fromMock: boolean; // веб-сервис недоступен — показана коллекция mock-объектов
  error: string | null;
}

const initialState: ProviderRoutersState = {
  sliderValue: 0,
  minBandwidthMbps: 0,
  items: [],
  loading: false,
  fromMock: false,
  error: null,
};

// 1. GET /api/provider_routers?min_bandwidth_mbps=… — список с фильтром
export const fetchProviderRouters = createAsyncThunk<
  { items: ProviderRouter[]; fromMock: boolean },
  number,
  { rejectValue: string }
>("providerRouters/fetch", async (minBandwidthMbps, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.getProviderRouters(
      minBandwidthMbps ? { min_bandwidth_mbps: minBandwidthMbps } : {},
    );
    return { items: (data ?? []).map(toProviderRouter), fromMock: false };
  } catch (error) {
    if (isBackendDown(error)) {
      return { items: await getProviderRoutersMock({ minBandwidthMbps }), fromMock: true };
    }
    return rejectWithValue(errorMessage(error, "Не удалось загрузить маршрутизаторы"));
  }
});

// 6. DELETE /api/provider_routers/{id} — логическое удаление своего маршрутизатора
export const deleteProviderRouter = createAsyncThunk<number, number, { rejectValue: string }>(
  "providerRouters/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.providerRouters.deleteProviderRouter(id);
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Не удалось удалить маршрутизатор"));
    }
  },
);

const providerRoutersSlice = createSlice({
  name: "providerRouters",
  initialState,
  reducers: {
    sliderChanged(state, action: PayloadAction<number>) {
      state.sliderValue = action.payload;
    },
    filterApplied(state) {
      state.minBandwidthMbps = state.sliderValue;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderRouters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderRouters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(fetchProviderRouters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Не удалось загрузить маршрутизаторы";
      })
      .addCase(deleteProviderRouter.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProviderRouter.rejected, (state, action) => {
        state.error = action.payload ?? "Не удалось удалить маршрутизатор";
      })
      // после выхода карточки больше не «свои»
      .addCase(loggedOut, (state) => {
        state.items = state.items.map((item) => ({ ...item, is_own: 0 }));
      });
  },
});

export const { sliderChanged, filterApplied } = providerRoutersSlice.actions;
export default providerRoutersSlice.reducer;
