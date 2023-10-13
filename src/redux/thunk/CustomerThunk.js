import {baseUrl} from "../../env/Config";
import axios from "axios";
import {addOrUpdate, getAll} from "../slice/CustomerSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllCustomer = (page,size,search,status) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/customer/getAll?page=${page}&size=${size}&search=${search}&status=${status}`);
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateCustomer = (customer) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/customer/addOrUpdate`,customer);
        dispatch(addOrUpdate(response.data));
    } catch (error) {
        console.log(error);
    }
};