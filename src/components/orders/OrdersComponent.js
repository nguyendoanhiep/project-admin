import {Button, Input, Pagination, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {getAllOrders} from "../../redux/thunk/OrdersThunk";

const {Search} = Input;

const OrdersComponent = () => {
    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            width: 160
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'name',
            width: 140
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code',
            key: 'code',
            width: 160
        },
        {
            title: 'Voucher sử dụng',
            dataIndex: 'voucherName',
            key: 'voucherName',
            width: 180
        },
        {
            title: 'Giá gốc',
            dataIndex: 'originalTotalValue',
            key: 'originalTotalValue',
            width: 110
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            width: 110
        },
        {
            title: 'Tổng giá trị',
            dataIndex: 'totalValue',
            key: 'totalValue',
            width: 110
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (text) => {
                switch (text) {
                    case 1:
                        return <span className='status-active'>Đang hoạt động</span>
                    case 2:
                        return <span className='status-inactive'>Không hoạt động</span>
                    default:
                        return 'Không rõ';
                }
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 120,
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 100 , backgroundColor:'#FFA500'}} type="primary"
                         onClick={() => console.log()} >Vô hiệu hóa</Button>
                </span>
            ),
            width: 130
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Đã sử dụng'},
    ];

    const dispatch = useDispatch();
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0,
    });
    const ordersList = useSelector((state) => state.orders.orders);


    const onSearch = async (value) => {
        const newParams = {...params, name: value}
        setParams(newParams)
        await dispatch(getAllOrders(newParams))
    };

    const handlePageChange = (e) => {
        const newParams = {...params, page: e}
        setParams(newParams)
        dispatch(getAllOrders(newParams))

    }
    useEffect(() => {
        dispatch(getAllOrders(params))
    }, [])
    return (
        <div style={{position: 'relative'}}>
            <div style={{
                display: 'flex',
                justifyContent: ' space-between'
            }}>
                <div>
                    <Select
                        placeholder="Select a status"
                        options={STATUS_OPTIONS}
                        onChange={(e) => setParams({...params, status: e})}
                    />
                    <Search
                        placeholder="Nhập số điện thoại "
                        allowClear
                        style={{
                            width: 250,
                            marginBottom: 20
                        }}
                        onSearch={value => onSearch(value)}
                    />
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={ordersList.content}
                pagination={false}
                bordered
                style={{
                    minHeight:600
                }}
                scroll={{
                    x:1100
                }}
            />
            <Pagination
                current={params.page}
                pageSize={params.size}
                total={ordersList.totalElements}
                onChange={handlePageChange}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
        </div>

    )
}

export default OrdersComponent