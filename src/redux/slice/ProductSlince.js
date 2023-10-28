import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {isGetData: false, products: {}},
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.products = action.payload.data;
        },
        addOrUpdate: (state, action) => {
        },
    },
});

export const {getAll,addOrUpdate} = productSlice.actions;

export default productSlice.reducer;