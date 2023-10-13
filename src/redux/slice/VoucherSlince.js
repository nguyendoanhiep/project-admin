import {createSlice} from "@reduxjs/toolkit";

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {isGetData: false, data: {} , isSaveSuccess : null},
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.data = action.payload.data;
        },
        addOrUpdate : (state,action) => {
            state.isSaveSuccess = action.payload.data
        }
    },
});

export const {getAll, addOrUpdate} = voucherSlice.actions;

export default voucherSlice.reducer;