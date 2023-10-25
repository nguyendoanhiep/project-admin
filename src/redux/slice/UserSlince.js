import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {isLoggedIn: false, users: {}},
    reducers: {
        register: (state, action) => {
        },
        login: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.data;
            state.token &&localStorage.setItem('Token', JSON.stringify('Bearer ' +  state.token));

        },
        logout: (state) => {
            state.isLoggedIn = false
            state.token = null;
            localStorage.removeItem('Token');
        },
        getALl: (state, action) => {
            state.users = action.payload.data;
        },
    },
});
export const {register, login, logout,getALl} = userSlice.actions;

export default userSlice.reducer;
