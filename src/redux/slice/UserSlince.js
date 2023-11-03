import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { users: {}},
    reducers: {
        login: (state, action) => {
            state.token = action.payload.data;
            state.token &&localStorage.setItem('Token', JSON.stringify('Bearer ' +  state.token));

        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('Token');
        },
        getALl: (state, action) => {
            state.users = action.payload.data;
        },
    },
});
export const {login, logout,getALl} = userSlice.actions;

export default userSlice.reducer;
