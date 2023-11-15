import {createSlice} from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: 'customer',
    initialState: { customers: {} ,customersByVoucherID:[] , customer : {}},
    reducers: {
        getAll: (state, action) => {
            state.customers = action.payload.data;
        },
        getAllByVoucherId: (state, action) => {
            state.customersByVoucherID = action.payload.data;
        },
        findById: (state, action) => {
            state.customer = action.payload.data;
        },
    },
});

export const {getAll,getAllByVoucherId,findById} = customerSlice.actions;

export default customerSlice.reducer;