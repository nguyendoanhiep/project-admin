import {baseUrl} from "../../env/Config";
import axios from "axios";
import {addOrUpdate, getAll, getAllImage} from "../slice/ProductSlince";

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
        dispatch(addOrUpdate(response.data));
        return response.data

    } catch (error) {
        console.log(error);
    }
};
export const getImageByProductId = (productId) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/product/getImageByProductId`, {
            params: {
                productId: productId
            }
        });
        dispatch(getAllImage(response.data));
    } catch (error) {
        console.log(error);
    }
};
export const setPriorityImage = (imageId, productId) => async (dispatch) => {
    try {
        return await axios.get(domain + `/product/setPriorityImage`, {
            params: {
                imageId: imageId,
                productId: productId
            }
        });
    } catch (error) {
        console.log(error);
    }
};
export const deleteImageOfProduct = (imageId) => async (dispatch) => {
    try {
        return await axios.get(domain + `/product/deleteImageOfProduct`, {
            params: {
                imageId: imageId
            }
        });
    } catch (error) {
        console.log(error);
    }
};