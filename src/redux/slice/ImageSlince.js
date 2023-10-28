import {createSlice} from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: 'image',
    initialState: {isGetData: false, images: [] },
    reducers: {
        getAllImageByProductId: (state, action) => {
            state.isGetData = true;
            state.images = action.payload.data;
        },
        clearImages: (state) => {
            state.images = [];
        },
    },
});

export const {getAllImageByProductId, clearImages} = imageSlice.actions;

export default imageSlice.reducer;