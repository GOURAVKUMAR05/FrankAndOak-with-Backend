"use client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { websiteBaseUrl } from "../config/config";
import { useSelector } from "react-redux";


// Remember we have to send user id to the api 
export const fetchCartData= createAsyncThunk(
    "carts/fetchCartdata",
    async(userId,{rejectWithValue})=>{              
        try{
            const response=await axios.get(
                websiteBaseUrl+`cart/view-cart/${userId}`
            );
            return response.data
        }
        catch(error){
            return rejectWithValue(error.message);
        }
    }
)

export const cartListSlice=createSlice({
    name:"cartList",
    initialState:{
        value:{},
        loading:true
    },
    reducers:{
        setCartList:(state,action)=>{
            state.value=action.payload
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCartData.pending,(state)=>{
            state.loading = true;
        })
        .addCase(fetchCartData.fulfilled, (state, action) => {
            state.loading = false; state.value = action.payload;
          })
        .addCase(fetchCartData.rejected, (state, action) => {
            state.loading = false; state.error = action.payload;
          });
    }



})

export const { setCartList } = cartListSlice.actions;

export default cartListSlice.reducer;