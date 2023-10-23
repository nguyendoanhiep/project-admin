import React, {useEffect, useState} from 'react';
import {AutoComplete, Button, Form, Image, Select, Table} from 'antd';
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {addOrUpdateOrders} from "../../redux/thunk/OrdersThunk";
import {findVoucherByNumberPhone} from "../../redux/thunk/VoucherThunk";
import {getAllCustomer} from "../../redux/thunk/CustomerThunk";

const CartComponent = () => {
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 180
        },
        {
            title: 'Hình ảnh',
            key: 'images',
            width: 150,
            render: (text) => {
                const image = text.images.find(data => data.priority === 1);
                if (image) {
                    return <Image style={{width: 140, height: 140, borderRadius: 10}} src={image.urlImage}/>;
                }
            }
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 100
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'price',
            width: 100
        },
        {
            title: 'Phân loại',
            dataIndex: 'type',
            key: 'type',
            width: 110,
            render: (text) => {
                switch (text) {
                    case 1:
                        return 'Loại 1'
                    case 2:
                        return 'Loại 2';
                    case 3:
                        return 'Loại 3';
                    default:
                        return 'Không rõ';
                }
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 100
        },

        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 40, backgroundColor: "#00CC00"}} type="primary"
                         onClick={() => addToCart(record)}>+</Button>
                 <Button style={{marginLeft: 5, width: 40, backgroundColor: '#FFA500'}} type="primary"
                         onClick={() => removeToCart(record)}>-</Button>
                </span>
            ),
            width: 110
        },
    ];
    const dispatch = useDispatch();
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const vouchersByNumberPhone = useSelector((state => state.voucher.vouchersByNumberPhone.data))
    const customers = useSelector((state => state.customer.data.content))
    const [isLoad, setIsLoad] = useState(false)
    const [originalTotalValue, setOriginalTotalValue] = useState()
    const [voucher, setVoucher] = useState({})
    const [totalValue, setTotalValue] = useState(0)
    const addToCart = (productOfCart) => {
        setIsLoad(!isLoad)
        const product = cartItems.find(item => item.id === productOfCart.id)
        if (product) {
            product.quantity += 1;
            product.totalPrice += productOfCart.price;
        } else {
            cartItems.push({...productOfCart, quantity: 1, totalPrice: productOfCart.price})
        }
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        toast.success('Thêm sản phẩm thành công!', {
            className: 'my-toast',
            position: "top-center",
            autoClose: 2000,
        });
    }
    const removeToCart = (productOfCart) => {
        setIsLoad(cartItems)
        const product = cartItems.find(item => item.id === productOfCart.id)
        if (product) {
            if (product.quantity == 1) {
                const newCart = cartItems.filter(item => item.id !== product.id);
                console.log(newCart)
                sessionStorage.setItem('cartItems', JSON.stringify(newCart));
                return toast.error('Xóa sản phẩm thành công!', {
                    className: 'my-toast',
                    position: "top-center",
                    autoClose: 2000,
                    limit: 4
                });
            }
            product.quantity -= 1;
            product.totalPrice -= productOfCart.price;
            toast.warning('Giảm số lượng thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        } else {
            cartItems.push({...productOfCart, quantity: 1, totalPrice: productOfCart.price})
        }
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));


    }
    const onSubmit = async (values) => {
        const ordersProducts = cartItems.map(item => {
            const newItem = {}
            newItem.ordersId = null;
            newItem.productId = item.id;
            newItem.quantity = item.quantity;
            newItem.totalPrice = item.totalPrice;
            return newItem;
        });
        values.voucherId = voucher.id;
        values.originalTotalValue = originalTotalValue
        values.discountAmount = voucher.value
        values.totalValue = totalValue
        values = {...values, ordersProducts: ordersProducts};
        const res = await dispatch(addOrUpdateOrders(values))
        if (res.data.code === 200) {
            toast.success('Tạo đơn hàng thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        } else {
            toast.error('Tạo đơn hàng thất bại!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            sessionStorage.removeItem("cartItems");
            setIsLoad(!isLoad)
        }
    };
    useEffect(() => {
        let total = cartItems && cartItems.reduce((accumulator, item) => {
            return accumulator + item.totalPrice;
        }, 0)
        setOriginalTotalValue(total)
        setTotalValue(total - (voucher.value || 0))
    }, [isLoad, voucher])

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: ' space-between'
            }}>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={cartItems}
                pagination={false}
                bordered
                scroll={{
                    x: 950
                }}
            />
            <div className="section-content  p-5 "
                 style={{maxWidth: 400, height: 400}}>
                <div className="heading-section text-center">
                    <Form
                        name="cart"
                        onFinish={onSubmit}
                        className="form"
                    >
                        <Form.Item
                            name="numberPhone"
                        >
                            <AutoComplete
                                options={customers && customers.map(customer => ({
                                    value: customer.numberPhone,
                                    label: customer.name + ' : ' + customer.numberPhone
                                }))}
                                onSearch={(e) => {
                                    setVoucher({})
                                    dispatch(getAllCustomer(1, 10, e, 1))
                                }}
                                onChange={(e) => dispatch(findVoucherByNumberPhone(e))}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Select
                                placeholder="Select Voucher"
                                value={voucher.name}
                                onChange={(e) => setVoucher(vouchersByNumberPhone.find(value => value.id === e))}
                                options={vouchersByNumberPhone && vouchersByNumberPhone.map(voucher => ({
                                    value: voucher.id,
                                    label: voucher.name + ' : ' + voucher.value + ' VND '
                                }))}>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="totalValue"
                        >
                            <div>
                                <h6> Tổng giá trị đơn hàng : {originalTotalValue} VND</h6>
                                <h6> Số tiền được giảm : {voucher.value} VND</h6>
                                <h6> Số tiền cần thanh toán : {totalValue} VND</h6>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit"
                                    className="login-form-button"
                                    style={{width: '120px', height: '40px'}}>
                                Tạo đơn hàng
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>

    )
}
export default CartComponent;