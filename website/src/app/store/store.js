
import { configureStore } from "@reduxjs/toolkit";
import loginStatusSlice from "../features/loginStatusSlice";
import userStatusSlice  from "../features/userSlice";
import cartStatusSlice from "../features/cartStatusSlice";
import productListSlice from "../features/productListSlice";
import cartListSlice from "../features/cartListSlice";
import cancelOrderStatusSlice from "../features/cancelOrderStatusSlice";

export const store=configureStore({
    reducer:{
        loginStatus:loginStatusSlice,
        userStatus:userStatusSlice,
        cartStatus:cartStatusSlice,
        productList:productListSlice,
        cartList:cartListSlice,
        cancelOrderStatus:cancelOrderStatusSlice,
    }
})