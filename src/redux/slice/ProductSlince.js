import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {isGetData: false, data: {} , images: {} },
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.data = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        },
        getAllImage: (state, action) => {
            state.images = action.payload;
        },
        clearImages: (state) => {
            state.images = null;
        },
    },
});

export const {getAll, addOrUpdate,getAllImage,clearImages} = productSlice.actions;

export default productSlice.reducer;