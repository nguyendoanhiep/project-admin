import axios from 'axios';
import {baseUrl} from '../../env/Config'
import {login,getALl} from "../slice/UserSlince";

const domain = baseUrl.host + baseUrl.port;
export const registerUser = (user) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/register', user);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = (username, password) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/login', {username, password});
        dispatch(login(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getAllUser = (params) => async (dispatch) => {
    try {
        const response = await axios.get(domain + '/user/getAll', {
            params: params
        });
        dispatch(getALl(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = (user) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/edit', user);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};