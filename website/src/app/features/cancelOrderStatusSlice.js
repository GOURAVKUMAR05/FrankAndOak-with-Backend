const { createSlice } = require("@reduxjs/toolkit");

export const cancelOrderStatusSlice=createSlice({
    name:"cancelOrderStatus",
    initialState:{
        value:false,
    },
    reducers:{
        setCancelOrderStatus: (state, action) => {
            state.value = action.payload;
       },
    }
})


export const {setCancelOrderStatus} = cancelOrderStatusSlice.actions

export default cancelOrderStatusSlice.reducer