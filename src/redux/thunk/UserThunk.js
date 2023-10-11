import axios from 'axios';
import {baseUrl} from '../../env/Config'
import {loginSuccess,registerSuccess} from "../slice/UserSlince";

const domain = baseUrl.host + baseUrl.port;
export const registerUser = (username, password, numberPhone, roles) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/register', {
            username,
            password,
            numberPhone,
            roles
        });
        dispatch(registerSuccess(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = (username, password) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/login', {username, password});
        dispatch(loginSuccess(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
