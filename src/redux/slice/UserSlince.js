import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {isLoggedIn : false , user: {}},
    reducers: {
        registerSuccess: (state, action) => {
            state.user = action.payload.data;
        },
        loginSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.token = action.payload.data;
            localStorage.setItem('Token', JSON.stringify('Bearer '+state.token));

        },
        logout: (state) => {
            state.isLoggedIn = false
            state.token = null;
            localStorage.removeItem('Token');
        },
    },
});
export const {registerSuccess , loginSuccess , logout } = userSlice.actions;

export default userSlice.reducer;
