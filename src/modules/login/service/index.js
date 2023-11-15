import axios from "axios";
import {login} from "../redux";
import {baseUrl} from "../../../env/Config";

const domain = baseUrl.host + baseUrl.port;

export const loginUser = (data) => async (dispatch) => {
    try {
        const response = await axios.post(domain + '/user/login', data);
        dispatch(login(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
    }
}