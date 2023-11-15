import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "../modules/home/components/index";
import Login from "../modules/login/components/index";
import Product from "../modules/product/components/index";
import Voucher from "../modules/voucher/components/index";
import Customer from "../modules/customer/components/index";
import User from "../modules/user/components/index";
import Cart from "../modules/cart/components/index";
import Orders from "../modules/orders/components/index";

const RouterMain = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/product" element={<Product/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/voucher" element={<Voucher/>}/>
            <Route path="/customer" element={<Customer/>}/>
            <Route path="/user" element={<User/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/orders" element={<Orders/>}/>
        </Routes>
    )
};
export default RouterMain;