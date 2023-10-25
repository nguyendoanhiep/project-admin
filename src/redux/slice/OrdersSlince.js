import {createSlice} from "@reduxjs/toolkit";

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {isGetData: false, orders: {} },
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.orders = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        }
    },
});

export const {getAll, addOrUpdate} = ordersSlice.actions;

export default ordersSlice.reducer;