import {createSlice} from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: 'customer',
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

export const {getAll, addOrUpdate} = customerSlice.actions;

export default customerSlice.reducer;