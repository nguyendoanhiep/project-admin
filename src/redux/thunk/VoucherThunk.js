import {baseUrl} from "../../env/Config";
import axios from "axios";
import {getAll,addOrUpdate,findByNumberPhone} from "../slice/VoucherSlince";

const domain = baseUrl.host + baseUrl.port;
export const getAllVoucher = (page,size,name,code,status,ascOrDesc) => async (dispatch) => {
    try {
        const response = await axios.get(domain + `/voucher/getAll`,{
            params: {
                page: page,
                size: size,
                name: name,
                code: code,
                status: status,
                ascOrDesc: ascOrDesc
            }
        });
        await dispatch(getAll(response.data));
    } catch (error) {
        console.log(error);
    }
};

export const addOrUpdateVoucher = (voucher) => async (dispatch) => {
    try {
        const response = await axios.post(domain + `/voucher/addOrUpdate`,voucher);
        await dispatch(addOrUpdate(response.data));
        return response;
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
