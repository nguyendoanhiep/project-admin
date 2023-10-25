import {createSlice} from "@reduxjs/toolkit";

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {isGetData: false, vouchers: {}  , vouchersByNumberPhone : []},
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.vouchers = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        },
        findByNumberPhone : (state,action) => {
            state.vouchersByNumberPhone = action.payload.data
        }
    },
});

export const {getAll, addOrUpdate,findByNumberPhone} = voucherSlice.actions;

export default voucherSlice.reducer;