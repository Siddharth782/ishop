import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { user: JSON.parse(localStorage?.getItem('auth'))?.user, token: JSON.parse(localStorage?.getItem('auth'))?.token },

    reducers: {
        logIn(state, actions) {
            state.user = actions.payload?.user
        },
        logOut(state) {
            state.user = null
        }
    }
})

export const authActions = authSlice.actions;

export default authSlice