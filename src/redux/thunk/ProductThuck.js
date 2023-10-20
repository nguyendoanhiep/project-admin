import {baseUrl} from "../../env/Config";
import axios from "axios";
import {addOrUpdate, getAll} from "../slice/ProductSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllProduct = (page, size, name, status, type) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/product/getAll`, {
            params: {
                page: page,
                size: size,
                name: name,
                status: status,
                type: type
            }
        });
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateProduct = (product) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/product/addOrUpdate`, product);
        dispatch(addOrUpdate(response.data));
        return response;

    } catch (error) {
        console.log(error);
    }
};