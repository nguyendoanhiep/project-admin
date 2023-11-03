import {baseUrl} from "../../env/Config";
import axios from "axios";
import {getAll} from "../slice/ProductSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllProduct = (params) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/product/getAll`, {
            params: params

        });
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateProduct = (product) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/product/addOrUpdate`, product);
        return response.data

    } catch (error) {
        console.log(error);
    }
};


export const deleteProduct = (id) => async () => {
    try {
        const res = await axios.post(domain + `/product/delete`, null,{
            params: {
                id : id
            }
        });
        return res.data
    } catch (error) {
        console.log(error);
    }
};