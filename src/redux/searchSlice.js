import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: { keyword: "", results: [] },

    reducers: {
        inputSearch(state, actions) {
            state.keyword = actions.payload?.keyword;
            state.results = actions.payload?.results;
        }
    }
})

export const searchActions = searchSlice.actions;

export default searchSlice