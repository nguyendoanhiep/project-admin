import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import userReducer from './slice/UserSlince'
import productReducer from './slice/ProductSlince'
import voucherReducer from './slice/VoucherSlince'
import CustomerReducer from './slice/CustomerSlince'
export default configureStore({
    reducer: {
        user: userReducer,
        product : productReducer,
        voucher : voucherReducer,
        customer : CustomerReducer
    },
    middleware: [thunkMiddleware],

})
