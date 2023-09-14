import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import searchSlice from "./searchSlice"

export const rootReducer = combineReducers({
    auth: authSlice.reducer,
    search: searchSlice.reducer
})