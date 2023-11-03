import {createSlice} from "@reduxjs/toolkit";

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {orders: {} },
    reducers: {
        getAll: (state, action) => {
            state.orders = action.payload.data;
        },
    },
});

export const {getAll} = ordersSlice.actions;

export default ordersSlice.reducer;