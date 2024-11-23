import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { websiteBaseUrl } from "../config/config";

export const fetchProducts = createAsyncThunk(
  "products/fetchproducts",
  async (_, { rejectWithValue }) => {
    // the _ is to be used if we are sending any id or data to the api url.
    try {
      const response = await axios.get(
        websiteBaseUrl + "products/active-products"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const productListSlice = createSlice({
  name: "productList",
  initialState: {
    value: [],
    loading: true,
    error: null,
  },
  reducers: {
    setProductPath: (state, action) => {
        state.path = action.payload; 
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
         state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false; state.value = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  },
});

export const { setProductList, setProductPath } = productListSlice.actions;

export default productListSlice.reducer;
