import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
      async (query, { rejectWithValue }) => {
    // 검색시 query 사용 
    try {
      const response = await api.get('/product', { params: { ...query } })
      console.log("뭐냐", response)
    
      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`)
      console.log("과연", response)

      return response.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/product', formData)

      dispatch(showToastMessage({ message: "상품 생성 완료", status: "success" }))
      dispatch(getProductList({ page: 1 }))
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`)

      dispatch(showToastMessage({ message: "상품 삭제 완료", status: "success" }))
      dispatch(getProductList({ page: 1 }))
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData)

      // 수정후 바뀐 정보 가져오기  
      dispatch(getProductList({ page: 1 }))
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.error)
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => { state.loading = true })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false
        state.error = ""
        state.success = true
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false // 실패시 창 안닫히고 메세지보여줌
      })
      .addCase(getProductList.pending, (state) => { state.loading = true })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false
        state.productList = action.payload.data
        state.error = ""
        state.totalPageNum = action.payload.totalPageNum
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(editProduct.pending, (state, action) => {
        state.loading = true
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false
        state.error = ""
        state.success = true
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true
        state.selectedProduct = null // 기존 데이터 초기화
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false
        state.error = ""
        state.success = true
        state.selectedProduct = action.payload.data // 상세 정보 저장
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
        state.selectedProduct = null
      });
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
