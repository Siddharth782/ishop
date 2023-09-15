import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: { cart: [] },

    reducers: {
        addToCart(state, actions) {
            state.cart?.push(actions.payload?.product);
        },
        removeFromCart(state, actions) {
            state.cart = actions.payload?.cart;
        },
        emptyCart(state) {
            state.cart = []
        }
    }
})

export const cartActions = cartSlice.actions;

export default cartSlice