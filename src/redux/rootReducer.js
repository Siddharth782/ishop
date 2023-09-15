import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import searchSlice from "./searchSlice"
import cartSlice from "./cartSlice"

export const rootReducer = combineReducers({
    auth: authSlice.reducer,
    search: searchSlice.reducer,
    cart: cartSlice.reducer
})