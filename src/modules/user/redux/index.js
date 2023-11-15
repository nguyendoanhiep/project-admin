import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { users: {}},
    reducers: {
        getALl: (state, action) => {
            state.users = action.payload.data;
        },
    },
});
export const {getALl} = userSlice.actions;

export default userSlice.reducer;
