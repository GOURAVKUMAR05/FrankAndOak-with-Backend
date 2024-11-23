
import { createSlice } from "@reduxjs/toolkit";

export const loginStatusSlice=createSlice({
    name:"loginStatus",
    initialState:{
        value:false,
    },
    reducers:{
        setLoginStatus: (state, action) => {
            console.log(action)
            state.value = action.payload;
       },
    }
})

export const {setLoginStatus} = loginStatusSlice.actions

export default loginStatusSlice.reducer