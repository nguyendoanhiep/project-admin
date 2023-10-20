import {createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {isGetData: false, data: {} },
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.data = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        }
    },
});

export const {getAll, addOrUpdate} = productSlice.actions;

export default productSlice.reducer;