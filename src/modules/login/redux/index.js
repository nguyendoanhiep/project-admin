import {createSlice} from '@reduxjs/toolkit';

const loginSlice = createSlice({
    name: 'login',
    initialState: {token: null},
    reducers: {
        login: (state, action) => {
            state.token = action.payload.data;
            state.token && localStorage.setItem('Token', JSON.stringify('Bearer ' + state.token));

        },
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('Token');
        },
    },
});
export const {login, logout} = loginSlice.actions;

export default loginSlice.reducer;
