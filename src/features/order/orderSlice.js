import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { a } from "@react-spring/web";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/order', payload)
      dispatch(getCartQty())
      return response.data.orderNum
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: 'error' }))
      return rejectWithValue(error.error)
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/order/me')

      return {
        orderList: response.data.data || [],
        totalPageNum: response.data.totalPageNum || 1,
      }
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get('/order', { params: { ...query } })
      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status })

      dispatch(getOrderList())
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true
    })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orderNum = action.payload
        state.error = ""
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orderList = action.payload.orderList
        state.totalPageNum = action.payload.totalPageNum
        state.error = ""
        // state.totalPageNum = action.payload
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.orderList = []
      })
      .addCase(getOrderList.pending, (state) => { state.loading = true })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false
        state.orderList = action.payload.data
        state.error = ""
        state.totalPageNum = action.payload.totalPageNum
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateOrder.pending, (state) => { state.loading = true })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false
        state.order = action.payload.data
        state.error = ""
        state.totalPageNum = action.payload.totalPageNum
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
