import {createSlice} from "@reduxjs/toolkit";

const ordersSlice = createSlice({
    name: 'orders',
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

export const {getAll, addOrUpdate} = ordersSlice.actions;

export default ordersSlice.reducer;