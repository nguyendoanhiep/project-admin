import {Avatar, Button, DatePicker, Input, Modal, Pagination, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    addOrUpdateVoucher,
    addVoucherForCustomer,
    deleteVoucher,
    getAllVoucher,
    removeVoucherForCustomer
} from "../../redux/thunk/VoucherThunk";
import moment from "moment";
import {toast} from "react-toastify";
import {getAllCustomer} from "../../redux/thunk/CustomerThunk";

const {Search} = Input;

const VoucherComponent = () => {
    const columns = [
        {
            title: 'Tên Voucher',
            dataIndex: 'name',
            key: 'name',
            width: 180
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 140
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            width: 110
        },
        {
            title: 'Số lượng ',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100
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
            title: 'Ngày có hiệu lực',
            dataIndex: 'voucherStartDate',
            key: 'voucherStartDate',
            width: 130,
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'voucherExpirationDate',
            key: 'voucherExpirationDate',
            width: 130,
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <Button style={{marginLeft: 5, width: 110}} type="primary"
                            onClick={() => openAddOrUpdate(record)}>Edit</Button>
                    <Button style={{marginLeft: 5, width: 110}} type="primary"
                            onClick={() => handleDelete(record)} danger>Delete</Button>
                    <Button style={{marginLeft: 5, width: 110}} type="primary"
                            onClick={() => openAddVoucherForCus(record)}> Gán Voucher</Button>
                </span>
            ),
            width: 120
        },
    ];

    const columnsCus = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            width: 160
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
            width: 120
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 120
        },
        {
            title: 'Điểm thưởng',
            dataIndex: 'loyaltyPoints',
            key: 'loyaltyPoints',
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
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
            fixed: 'right',
            render: (text, record) => (
                <span>
                    {
                        !numberPhoneList.find(value => value === record.numberPhone) &&
                        <Button style={{marginLeft: 5, width: 70}} type="primary"
                                onClick={() => handleAddVoucherForCus(record)}>Chose
                        </Button>
                    }
                    {
                        numberPhoneList.find(value => value === record.numberPhone) &&
                        <Button style={{marginLeft: 5, width: 70}} type="primary"
                                onClick={() => handleRemoveCusForVoucher(record)} danger>Delete
                        </Button>
                    }
                </span>
            ),
            width: 100
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Đã sử dụng'},
    ];

    const dispatch = useDispatch();
    const [voucher, setVoucher] = useState({})
    const [numberPhoneList, setNumberPhoneList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isAddVoucher, setIsAddVoucher] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0,
    });
    const [paramsCus, setParamsCus] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0
    });

    const voucherList = useSelector((state) => state.voucher.vouchers);
    const customerList = useSelector((state) => state.customer.customers);

    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            setVoucher(record);
        } else {
            setIsCreate(true)
            setVoucher({
                status: 1
            });
        }
    };

    const openAddVoucherForCus = (record) => {
        setIsAddVoucher(true)
        setVoucher(record)
    }

    const handleRemoveCusForVoucher = async (record) => {
        const res = await dispatch(removeVoucherForCustomer(record.numberPhone,voucher.id))
        if( res.code === 200) {
            toast.success('Xóa Voucher khỏi khách hàng thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
        if (res.code === 400) {
            toast.error('Không thể Xóa Voucher khỏi khách hàng , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handleAddVoucherForCus = async (record) => {
        const res = await dispatch(addVoucherForCustomer(record.numberPhone,voucher.id))
        if( res.code === 200) {
            toast.success('Thêm Voucher cho khách hàng thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
        if (res.code === 400) {
            toast.error('Không thể thêm voucher cho khách hàng , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }

    }

    const closeAddVoucherForCus = () => {
        setIsAddVoucher(false)
        setNumberPhoneList([])
    }
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setVoucher({})
    }
    const handleDelete = async (record) => {
        const res = await dispatch(deleteVoucher(record.id))
        if (res.code === 200) {
            toast.success('Xóa Voucher thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Không thể xóa , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }

    };
    const onSearch = (value) => {
        const newParams = {...params, search: value}
        setParams(newParams)
        dispatch(getAllVoucher(newParams))
    };
    const handleAddOrUpdate = async () => {
        const res = await dispatch(addOrUpdateVoucher(voucher))
        if (res.code === 200 && isCreate) {
            toast.success('Thêm Voucher thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 200 && !isCreate) {
            toast.success('Sửa Voucher thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Thêm Voucher thất bại!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handlePageChange = (e) => {
        const newParams = {...params, page: e}
        setParams(newParams)
        dispatch(getAllVoucher(newParams))

    }
    const onSearchCus = async (value) => {
        setParamsCus({...paramsCus, search: value})
    };

    useEffect(() => {
        dispatch(getAllVoucher(params))
    }, [isLoading])

    useEffect(() => {
        dispatch(getAllCustomer(paramsCus))
    }, [paramsCus])

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
                        placeholder="Nhập tên sản phẩm"
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
                            }}> Thêm Voucher </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={voucherList.content}
                pagination={false}
                bordered
                style={{
                    minHeight: 600
                }}
                scroll={{
                    x: 1100
                }}
            />
            <Pagination
                current={params.page}
                pageSize={params.size}
                total={voucherList.totalElements}
                onChange={handlePageChange}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
            <Modal title={isCreate ? "Thêm mới Voucher" : "Chỉnh sửa Voucher"} open={isAddOrUpdate}
                   onOk={handleAddOrUpdate}
                   onCancel={closeAddOrUpdate}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Tên Voucher"
                        value={voucher.name || ''}
                        onChange={(e) => setVoucher({...voucher, name: e.target.value})}
                    />
                    {
                        !isCreate ?
                            <Input
                                style={{width: 350, marginTop: 10, marginBottom: 10}}
                                type="text"
                                placeholder="Code"
                                value={voucher.code || ''}
                                onChange={(e) => setVoucher({...voucher, code: e.target.value})}
                            /> : null
                    }
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Giá trị"
                        value={voucher.value || ''}
                        onChange={(e) => setVoucher({...voucher, value: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số lượng"
                        value={voucher.quantity}
                        onChange={(e) => setVoucher({...voucher, quantity: e.target.value || 0})}
                    />
                    <Select
                        key={voucher.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        defaultValue={isCreate ? 1 : voucher.status}
                        onChange={(e) => setVoucher({...voucher, status: e})}
                        options={STATUS_OPTIONS}
                    />
                    <DatePicker
                        value={voucher.voucherStartDate ? moment(voucher.voucherStartDate, "DD-MM-YYYY HH:mm:ss") : null}
                        onChange={(e) => {
                            setVoucher({...voucher, voucherStartDate: e && e.format("DD-MM-YYYY HH:mm:ss")})
                        }}
                        showTime/>
                    <DatePicker
                        value={voucher.voucherExpirationDate ? moment(voucher.voucherExpirationDate, "DD-MM-YYYY HH:mm:ss") : null}
                        onChange={(e) => setVoucher({
                            ...voucher,
                            voucherExpirationDate: e && e.format("DD-MM-YYYY HH:mm:ss")
                        })}
                        showTime/>
                </div>
            </Modal>
            <Modal width="800px"
                   open={isAddVoucher}
                   onOk={handleAddVoucherForCus}
                   onCancel={closeAddVoucherForCus}
            >
                <div>
                    <Select
                        placeholder="Select a status"
                        options={STATUS_OPTIONS}
                        onChange={(e) => setParamsCus({...paramsCus, status: e})}
                    />
                    <Search
                        placeholder="Nhập tên hoặc số điện thoại"
                        allowClear
                        style={{
                            width: 250,
                            marginBottom: 20
                        }}
                        onSearch={value => onSearchCus(value)}
                    />
                </div>
                <Table
                    rowKey={record => record.id}
                    columns={columnsCus}
                    dataSource={customerList.content}
                    pagination={false}
                    bordered
                    style={{
                        minHeight: 600
                    }}
                />
            </Modal>
        </div>

    )
}

export default VoucherComponent