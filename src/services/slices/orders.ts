import { getFeedsApi, getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logoutUser } from './user';

import type { TFeedState, TOrder } from '@utils-types';

type OrdersState = {
  feed: TFeedState;
  history: TOrder[];
  historyLoading: boolean;
  historyRequestId: string | null;
  historyError: string | null;
  details: Record<number, TOrder | undefined>;
  detailErrors: Record<number, string | undefined>;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
};

const initialState: OrdersState = {
  feed: { orders: [], total: 0, totalToday: 0, isLoading: false, error: null },
  history: [],
  historyLoading: false,
  historyRequestId: null,
  historyError: null,
  details: {},
  detailErrors: {},
  orderRequest: false,
  orderModalData: null,
  orderError: null,
};

export const fetchFeed = createAsyncThunk<
  Awaited<ReturnType<typeof getFeedsApi>>,
  void,
  { state: { orders: OrdersState } }
>('orders/feed', getFeedsApi, {
  condition: (_, { getState }) => !getState().orders.feed.isLoading,
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { state: { orders: OrdersState } }
>('orders/history', getOrdersApi, {
  condition: (_, { getState }) => !getState().orders.historyLoading,
});

export const fetchOrder = createAsyncThunk('orders/detail', async (number: number) => {
  const response = await getOrderByNumberApi(number);
  const order = response.orders?.[0];
  if (!response.success || !order) throw new Error('Заказ не найден');
  return order;
});

export const createOrder = createAsyncThunk('orders/create', orderBurgerApi);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrder: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feed.isLoading = true;
        state.feed.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed = { ...action.payload, isLoading: false, error: null };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feed.isLoading = false;
        state.feed.error = action.error.message ?? 'Ошибка запроса';
      })
      .addCase(fetchUserOrders.pending, (state, action) => {
        state.historyLoading = true;
        state.historyRequestId = action.meta.requestId;
        state.historyError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        if (state.historyRequestId !== action.meta.requestId) return;
        state.history = action.payload;
        state.historyLoading = false;
        state.historyRequestId = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        if (state.historyRequestId !== action.meta.requestId) return;
        state.historyLoading = false;
        state.historyRequestId = null;
        state.historyError = action.error.message ?? 'Ошибка запроса';
      })
      .addCase(fetchOrder.pending, (state, action) => {
        delete state.detailErrors[action.meta.arg];
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.details[action.payload.number] = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.detailErrors[action.meta.arg] = action.error.message ?? 'Ошибка запроса';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? 'Ошибка запроса';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.history = [];
        state.historyLoading = false;
        state.historyRequestId = null;
        state.historyError = null;
        state.details = {};
        state.detailErrors = {};
        state.orderModalData = null;
      }),
});

export const { closeOrder } = ordersSlice.actions;
