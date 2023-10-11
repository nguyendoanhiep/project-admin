import {baseUrl} from "../../env/Config";
import axios from "axios";
import {getAll,addOrUpdate} from "../slice/VoucherSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllVoucher = (page,size,name,code,status,ascOrDesc) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/voucher/getAll?page=${page}&size=${size}&name=${name}&code=${code}&status=${status}&ascOrDesc=${ascOrDesc}`);
        dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateVoucher = (voucher) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/voucher/addOrUpdate`,voucher);
        dispatch(addOrUpdate(response.data));
    } catch (error) {
        console.log(error);
    }
};