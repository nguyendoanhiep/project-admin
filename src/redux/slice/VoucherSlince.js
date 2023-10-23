import {createSlice} from "@reduxjs/toolkit";

const voucherSlice = createSlice({
    name: 'voucher',
    initialState: {isGetData: false, data: {} , vouchersByNumberPhone : {}},
    reducers: {
        getAll: (state, action) => {
            state.isGetData = true;
            state.data = action.payload.data;
        },
        addOrUpdate : (state,action) => {
        },
        findByNumberPhone : (state,action) => {
            state.vouchersByNumberPhone = action.payload
        }
    },
});

export const {getAll, addOrUpdate,findByNumberPhone} = voucherSlice.actions;

export default voucherSlice.reducer;