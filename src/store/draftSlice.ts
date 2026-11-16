import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import { errorMessage, errorStatus } from "../api/errors";
import { ProviderRouterDraft, toProviderRouterDraft } from "../modules/types";
import { loggedOut } from "./authSlice";

// Добавление маршрутизатора: черновик с файлами, затем публикация
interface DraftState {
  draft: ProviderRouterDraft | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: DraftState = {
  draft: null,
  loading: false,
  saving: false,
  error: null,
};

// 3. GET /api/provider_routers/draft — черновик текущего пользователя (404 — черновика нет)
export const fetchDraft = createAsyncThunk<
  ProviderRouterDraft | null,
  void,
  { rejectValue: string }
>("draft/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.getProviderRouterDraft();
    return toProviderRouterDraft(data);
  } catch (error) {
    if (errorStatus(error) === 404) return null;
    return rejectWithValue(errorMessage(error, "Не удалось загрузить черновик"));
  }
});

// 4. POST /api/provider_routers (multipart/form-data) — черновик с изображением и видео
export const createDraft = createAsyncThunk<
  ProviderRouterDraft,
  { name: string; image: File; video: File },
  { rejectValue: string }
>("draft/create", async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.createProviderRouter(form);
    return toProviderRouterDraft(data);
  } catch (error) {
    return rejectWithValue(errorMessage(error, "Не удалось сохранить черновик"));
  }
});

// 5. PUT /api/provider_routers/{id}/publish — публикация с полями по теме
export const publishDraft = createAsyncThunk<
  ProviderRouterDraft,
  { id: number; description: string; bandwidth_mbps: number; cost_rub: number },
  { rejectValue: string }
>("draft/publish", async ({ id, ...body }, { rejectWithValue }) => {
  try {
    const { data } = await api.providerRouters.publishProviderRouter(id, body);
    return toProviderRouterDraft(data);
  } catch (error) {
    return rejectWithValue(errorMessage(error, "Не удалось опубликовать маршрутизатор"));
  }
});

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraft.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload;
      })
      .addCase(fetchDraft.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Не удалось загрузить черновик";
      })
      .addCase(createDraft.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createDraft.fulfilled, (state, action) => {
        state.saving = false;
        state.draft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Не удалось сохранить черновик";
      })
      .addCase(publishDraft.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      // после публикации черновика нет — форма снова пустая
      .addCase(publishDraft.fulfilled, (state) => {
        state.saving = false;
        state.draft = null;
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Не удалось опубликовать маршрутизатор";
      })
      .addCase(loggedOut, () => initialState);
  },
});

export default draftSlice.reducer;
