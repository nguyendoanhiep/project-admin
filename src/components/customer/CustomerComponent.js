import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, Modal, Pagination, Select, Table} from 'antd';
import {addOrUpdateCustomer, getAllCustomer} from "../../redux/thunk/CustomerThunk";

const {Search} = Input;
const CustomerComponent = () => {
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            width: 180
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
            width: 140
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 120
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'email',
            width: 120
        },
        {
            title: ' Địa chỉ ',
            dataIndex: 'address',
            key: 'address',
            width: 120
        },
        {
            title: ' Ảnh đại diện',
            dataIndex: 'image_id',
            key: 'image_id',
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
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
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => openAddOrUpdate(record)}>Edit</Button>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => handleDelete(record)} danger>Delete</Button>
                </span>
            ),
            width: 180
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Không xác định'},
    ];

    const dispatch = useDispatch();
    const [customer, setCustomer] = useState({})
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search : '',
        status : 0
    });
    const customerList = useSelector((state) => state.customer.data);
    const isSaveData = useSelector((state) => state.customer.isSaveData)

    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            setCustomer(record);
        } else {
            setIsCreate(true)
            setCustomer({
                status: 1
            });
        }


    };
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setCustomer({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        setParams({...params, search: value})
        dispatch(getAllCustomer(params.page, params.size, value, params.status))
    };
    const handleAddOrUpdate = async () => {
        await dispatch(addOrUpdateCustomer(customer))
    }

    const handlePageChange = (e) => {
        setParams({...params, page: e})
        dispatch(getAllCustomer(e, params.size, params.search, params.status))

    }
    useEffect(() => {
        setIsAddOrUpdate(false);
        dispatch(getAllCustomer(params.page, params.size, params.search, params.status))
        console.log(customerList)
    }, [isSaveData])
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
                        placeholder="Nhập tên hoặc số điện thoại"
                        allowClear
                        style={{
                            width: 250,
                            marginBottom: 20
                        }}
                        onSearch={value => onSearch(value)}
                    />
                </div>
                <div>
                    <Button onClick={() => openAddOrUpdate()}
                            type="primary"
                            style={{
                                backgroundColor: "#00CC00",
                                minHeight: 32
                            }}> Thêm khách hàng mới </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                style={{
                    minHeight: 600
                }}
                columns={columns}
                dataSource={customerList.content}
                pagination={false} bordered/>
            <Pagination
                current={params.page}
                pageSize={params.size}
                total={customerList.totalElements}
                onChange={handlePageChange}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
            <Modal title={isCreate ? "Thêm khách hàng mới" : "Chỉnh sửa thông tin"} open={isAddOrUpdate}
                   onOk={handleAddOrUpdate}
                   onCancel={closeAddOrUpdate}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Tên khách hàng"
                        value={customer.name || ''}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số điện thoại"
                        value={customer.numberPhone || ''}
                        onChange={(e) => setCustomer({...customer, numberPhone: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số điện thoại"
                        value={customer.numberPhone || ''}
                        onChange={(e) => setCustomer({...customer, numberPhone: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số điện thoại"
                        value={customer.numberPhone || ''}
                        onChange={(e) => setCustomer({...customer, numberPhone: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số điện thoại"
                        value={customer.numberPhone || ''}
                        onChange={(e) => setCustomer({...customer, numberPhone: e.target.value})}
                    />
                    <Select
                        key={customer.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        value={customer.status ? customer.status : 1}
                        onChange={(e) => setCustomer({...customer, status: e})}
                        options={STATUS_OPTIONS}
                    />
                </div>
            </Modal>
        </div>

    )
}
export default CustomerComponent;