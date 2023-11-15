import {createSlice} from "@reduxjs/toolkit";

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: { vouchers: {}  , vouchersByNumberPhone : []},
    reducers: {
        getAll: (state, action) => {
            state.vouchers = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        },
        findByNumberPhone : (state,action) => {
            state.vouchersByNumberPhone = action.payload.data
        }
    },
});

export const {getAll,findByNumberPhone} = voucherSlice.actions;

export default voucherSlice.reducer;