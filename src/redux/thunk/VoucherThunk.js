import {baseUrl} from "../../env/Config";
import axios from "axios";
import {getAll,findByNumberPhone} from "../slice/VoucherSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllVoucher = (params) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/voucher/getAll`,{
            params: params
        });
        await dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateVoucher = (voucher) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/voucher/addOrUpdate`,voucher);
        return response.data
    } catch (error) {
        console.log(error);
    }
};

export const findVoucherByNumberPhone = (numberPhone) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/voucher/findByNumberPhone`,{
            params: {
                numberPhone: numberPhone,
            }
        });
        await dispatch(findByNumberPhone(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const deleteVoucher = (id) => async () => {
    try {
        const res = await axios.post(domain + `/voucher/delete`, null,{
            params: {
                id : id
            }
        });
        return res.data
    } catch (error) {
        console.log(error);
    }
};

export const addVoucherForCustomer = (numberPhone , voucherId) => async () => {
    try {
        const res = await axios.post(domain + `/voucher/addVoucherForCustomer`,null,{
            params: {
                numberPhone : numberPhone,
                voucherId : voucherId
            }
        });
        return res.data
    } catch (error) {
        console.log(error);
    }
};

export const removeVoucherForCustomer = (numberPhone , voucherId) => async () => {
    try {
        const res = await axios.post(domain + `/voucher/removeVoucherForCustomer`,null,{
            params: {
                numberPhone : numberPhone,
                voucherId : voucherId
            }
        });
        return res.data
    } catch (error) {
        console.log(error);
    }
};