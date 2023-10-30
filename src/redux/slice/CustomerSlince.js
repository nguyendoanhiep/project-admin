import {createSlice} from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: 'customer',
    initialState: {isGetData: false, customers: {} ,customersByVoucherID:[]},
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.customers = action.payload.data;
        },
        getAllByVoucherId: (state, action) => {
            state.isGetData = true;
            state.customersByVoucherID = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        }
    },
});

export const {getAll, addOrUpdate,getAllByVoucherId} = customerSlice.actions;

export default customerSlice.reducer;