import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk';
import userReducer from '../../src/modules/user/redux/index'
import loginReducer from '../../src/modules/login/redux/index'
import productReducer from '../../src/modules/product/redux/index'
import voucherReducer from '../../src/modules/voucher/redux/index'
import customerReducer from '../../src/modules/customer/redux/index'
import ordersReducer from '../../src/modules/orders/redux/index'
import imageReducer  from '../../src/modules/image/redux/index'
export default configureStore({
    reducer: {
        user: userReducer,
        product : productReducer,
        voucher : voucherReducer,
        customer : customerReducer,
        orders : ordersReducer,
        image : imageReducer,
        login : loginReducer
    },
    middleware: [thunkMiddleware],

})
