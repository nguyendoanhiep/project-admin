import {baseUrl} from "../../env/Config";
import axios from "axios";
import {addOrUpdate, getAll} from "../slice/ProductSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllProduct = (page,size,search) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/product/getAll?page=${page}&size=${size}&search=${search}`);
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateProduct = (product) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/product/addOrUpdate`,product);
        dispatch(addOrUpdate(response.data));
    } catch (error) {
        console.log(error);
    }
};