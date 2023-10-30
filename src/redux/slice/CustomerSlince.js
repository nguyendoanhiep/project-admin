import {createSlice} from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: 'customer',
    initialState: {isGetData: false, customers: {} ,customersByVoucherID:[] , customer : {}},
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
        },
        findById: (state, action) => {
            state.customer = action.payload.data;
        },
    },
});

export const {getAll, addOrUpdate,getAllByVoucherId,findById} = customerSlice.actions;

export default customerSlice.reducer;