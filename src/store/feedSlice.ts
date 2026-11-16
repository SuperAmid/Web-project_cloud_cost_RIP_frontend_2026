import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import { errorMessage, errorStatus, isBackendDown } from "../api/errors";
import { getProviderRouterFeedMock } from "../modules/providerRoutersApi";
import { ProviderRouter, toProviderRouter } from "../modules/types";
import { loggedOut } from "./authSlice";

// Лента: одна карточка маршрутизатора
interface FeedState {
  item: ProviderRouter | null;
  loading: boolean;
  notFound: boolean;
  fromMock: boolean;
  error: string | null;
}

const initialState: FeedState = {
  item: null,
  loading: false,
  notFound: false,
  fromMock: false,
  error: null,
};

// 2. GET /api/provider_routers/feed[?id=…[&next=true]] — первая, по id или следующая карточка
export const fetchFeed = createAsyncThunk<
  { item: ProviderRouter | null; fromMock: boolean },
  { id?: number; next?: boolean },
  { rejectValue: string }
>("feed/fetch", async ({ id, next }, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.getProviderRouterFeed({
      ...(id !== undefined ? { id } : {}),
      ...(next ? { next: true } : {}),
    });
    return { item: toProviderRouter(data), fromMock: false };
  } catch (error) {
    if (errorStatus(error) === 404) {
      return { item: null, fromMock: false };
    }
    if (isBackendDown(error)) {
      return { item: (await getProviderRouterFeedMock(id, next)) ?? null, fromMock: true };
    }
    return rejectWithValue(errorMessage(error, "Не удалось загрузить ленту"));
  }
});

// 7. POST /api/provider_routers/{id}/like — {"like": 1} ставит, {"like": 0} снимает
export const toggleLike = createAsyncThunk<
  { id: number; is_liked: 0 | 1; likes_count: number },
  { id: number; like: boolean },
  { rejectValue: string }
>("feed/like", async ({ id, like }, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.likeProviderRouter(id, { like: like ? 1 : 0 });
    return {
      id,
      is_liked: data.is_liked === 1 ? 1 : 0,
      likes_count: data.likes_count ?? 0,
    };
  } catch (error) {
    return rejectWithValue(errorMessage(error, "Не удалось поставить лайк"));
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.item;
        state.notFound = action.payload.item === null;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Не удалось загрузить ленту";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.item && state.item.id === action.payload.id) {
          state.item.is_liked = action.payload.is_liked;
          state.item.likes_count = action.payload.likes_count;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload ?? "Не удалось поставить лайк";
      })
      .addCase(loggedOut, (state) => {
        if (state.item) state.item.is_liked = 0;
      });
  },
});

export default feedSlice.reducer;
