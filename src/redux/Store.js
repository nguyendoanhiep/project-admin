import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import userReducer from './slice/UserSlince'
import productReducer from './slice/ProductSlince'
import voucherReducer from './slice/VoucherSlince'
export default configureStore({
    reducer: {
        user: userReducer,
        product : productReducer,
        voucher : voucherReducer
    },
    middleware: [thunkMiddleware],

})
