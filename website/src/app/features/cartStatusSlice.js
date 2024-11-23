
import { createSlice } from "@reduxjs/toolkit";

export const cartStatusSlice=createSlice({
    name:"cartStatus",
    initialState:{
        value:false,
    },
    reducers:{
        setCartStatus: (state, action) => {
            state.value = action.payload;
       },
    }
})

export const {setCartStatus} = cartStatusSlice.actions

export default cartStatusSlice.reducer