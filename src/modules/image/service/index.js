import axios from "axios";
import {baseUrl} from "../../../env/Config";
import {getAllImageByProductId} from "../redux";

const domain = baseUrl.host + baseUrl.port;

export const getImageByProductId = (productId) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/image/getImageByProductId`, {
            params: {
                productId: productId
            }
        });
        dispatch(getAllImageByProductId(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addImage = (image) => async () => {
    try {
        const res = await axios.post(domain + `/image/add`, image);
        return res.data
    } catch (error) {
        console.log(error);
    }
};
export const setPriorityImage = (imageId, productId) => async () => {
    try {
        return await axios.post(domain + `/image/setPriorityImage`,null, {
            params: {
                imageId: imageId,
                productId: productId
            }
        });
    } catch (error) {
        console.log(error);
    }
};
export const deleteImageOfProduct = (id) => async () => {
    try {
        return await axios.post(domain + `/image/delete`, null,{
            params: {
                id : id
            }
        });
    } catch (error) {
        console.log(error);
    }
};