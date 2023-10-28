import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import userReducer from './slice/UserSlince'
import productReducer from './slice/ProductSlince'
import voucherReducer from './slice/VoucherSlince'
import customerReducer from './slice/CustomerSlince'
import ordersReducer from './slice/OrdersSlince'
import imageReducer  from './slice/ImageSlince'
export default configureStore({
    reducer: {
        user: userReducer,
        product : productReducer,
        voucher : voucherReducer,
        customer : customerReducer,
        orders : ordersReducer,
        image : imageReducer
    },
    middleware: [thunkMiddleware],

})
