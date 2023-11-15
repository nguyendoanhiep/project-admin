import {baseUrl} from "../../../env/Config";
import axios from "axios";
import { findById, getAll, getAllByVoucherId} from "../redux";

const domain = baseUrl.host + baseUrl.port;
export const getAllCustomer = (params) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/customer/getAll`,{
            params: params
        });
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const findCustomerById = (id) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/customer/findById`,{
            params: {
                id:id
            }
        });
        dispatch(findById(response.data));
    } catch (error) {
        console.log(error);
    }
};
export const getAllCustomerByVoucherId = (params) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/customer/getAllByVoucherId`,{
            params: params
        });
        dispatch(getAllByVoucherId(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateCustomer = (customer) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/customer/addOrUpdate`,customer);
        return response.data
    } catch (error) {
        console.log(error);
    }
};