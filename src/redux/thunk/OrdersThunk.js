import {baseUrl} from "../../env/Config";
import axios from "axios";
import {addOrUpdate, getAll} from "../slice/OrdersSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllOrders = (page,size,search,status) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/orders/getAll`,{
            params:{
                page: page,
                size: size,
                search: search,
                status: status
            }
        });
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateOrders = (orders) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/orders/addOrUpdate`,orders);
        dispatch(addOrUpdate(response.data));
        return response;
    } catch (error) {
        console.log(error);
    }
};