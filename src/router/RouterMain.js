import React from "react";
import {Routes, Route} from "react-router-dom";
import HomeComponent from "../components/home/HomeComponent";
import LoginComponent from "../components/login/LoginComponent";
import ProductComponent from "../components/product/ProductComponent";
import VoucherComponent from "../components/voucher/VoucherComponent";

const RouterMain = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeComponent/>}/>
            <Route path="/product" element={<ProductComponent/>}/>
            <Route path="/login" element={<LoginComponent/>}/>
            <Route path="/voucher" element={<VoucherComponent/>}/>
        </Routes>
    )
};
export default RouterMain;