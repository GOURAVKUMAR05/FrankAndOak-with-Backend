
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const userStatusSlice=createSlice({
    name:"userStatus",
    initialState:{
        value: Cookies.get("frank_Oak_User") ? JSON.parse(Cookies.get("frank_Oak_User")) : {},
    },
    reducers:{
        storeUserData: (state, action) => {
            // console.log(action)
            state.value = action.payload;
            Cookies.set("frank_Oak_User",JSON.stringify(state.value))
       },
       logOut:(state,action)=>{
        state.value={}
        Cookies.remove("frank_Oak_User")
       }
    }
})

export const {storeUserData, logOut} = userStatusSlice.actions

export default userStatusSlice.reducer