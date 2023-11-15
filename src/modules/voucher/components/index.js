import {Button, DatePicker, Form, Input, Modal, Pagination, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import dayjs from "dayjs";
import {getAllCustomerByVoucherId} from "../../customer/service";
import {
    addOrUpdateVoucher,
    addVoucherForCustomer,
    deleteVoucher,
    getAllVoucher,
    removeVoucherForCustomer
} from "../service";

const {Search} = Input;

const Voucher = () => {
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
            width: 150
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
            width: 90
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
            align: 'center',
            render: (text, record) => (
                <span>
                    <Button style={{margin: 5, width: 110}} type="primary"
                            onClick={() => openAddOrUpdate(record)}>Edit</Button>
                    <Button style={{margin: 5, width: 110, backgroundColor: "#00CC00"}} type="primary"
                            onClick={() => openAddVoucherForCus(record)}> Add Voucher</Button>
                    <Button style={{margin: 5, width: 110}} type="primary"
                            onClick={() => handleDelete(record)} danger>Delete</Button>

                </span>
            ),
            width: 135
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
            align: 'center',
            render: (text, record) => (
                <span>
                    {
                        record.result === 0 &&
                        <Button style={{marginLeft: 5, width: 70, backgroundColor: "#00CC00"}} type="primary"
                                onClick={() => handleAddVoucherForCus(record)}>Chose
                        </Button>
                    }
                    {
                        record.result === 1 &&
                        <Button style={{marginLeft: 5, width: 70, backgroundColor: '#FFA500'}} type="primary"
                                onClick={() => handleRemoveCusForVoucher(record)}>Cancel
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
    const [isLoading, setIsLoading] = useState(false)
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isAddVoucher, setIsAddVoucher] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [voucherId, setVoucherId] = useState();
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
        voucherId: 0
    });

    const voucherList = useSelector((state) => state.voucher.vouchers);
    const customerList = useSelector((state) => state.customer.customersByVoucherID);
    const [voucherForm] = Form.useForm();
    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            voucherForm.setFieldsValue(record);
        } else {
            setIsCreate(true)
            voucherForm.setFieldsValue({
                status: 1,
                voucherStartDate: dayjs().format("DD-MM-YYYY HH:mm:ss"),
                voucherExpirationDate: dayjs().format("DD-MM-YYYY HH:mm:ss")
            })
        }
    }
    const openAddVoucherForCus = (record) => {
        setVoucherId(record.id)
        setIsAddVoucher(true)
        const data = {...params, voucherId: record.id}
        setParamsCus(data)
        dispatch(getAllCustomerByVoucherId(data))
    }

    const handleRemoveCusForVoucher = async (record) => {
        const res = await dispatch(removeVoucherForCustomer(record.numberPhone, voucherId))
        if (res.code === 200) {
            toast.warning('Xóa khách hàng khỏi voucher thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            await dispatch(getAllCustomerByVoucherId(paramsCus))
        }
        if (res.code === 400) {
            toast.error('Không thể xóa khách hàng khỏi voucher , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handleAddVoucherForCus = async (record) => {
        const res = await dispatch(addVoucherForCustomer(record.numberPhone, voucherId))
        if (res.code === 200) {
            toast.success('Thêm Voucher cho khách hàng thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            await dispatch(getAllCustomerByVoucherId(paramsCus))
        }
        if (res.code === 400) {
            toast.error('Không thể thêm voucher cho khách hàng , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }

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
    const handleAddOrUpdate = async (values) => {
        const res = await dispatch(addOrUpdateVoucher(values))
        if (res.code === 200) {
            toast.success(isCreate ? 'Thêm mới thành công!' : 'Cập nhập thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
            await voucherForm.resetFields()
        } else {
            toast.error(isCreate ? 'Thêm mới thất bại! đã có lỗi xảy ra' : ' Cập nhập thất bại! đã có lỗi xảy ra' , {
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
        const data = {...paramsCus, search: value}
        setParamsCus(data)
        await dispatch(getAllCustomerByVoucherId(data))
    };

    useEffect(() => {
        dispatch(getAllVoucher(params))
    }, [isLoading])

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
            <Modal title={isCreate ? "Thêm mới Voucher" : "Chỉnh sửa Voucher"}
                   open={isAddOrUpdate}
                   footer={null}
                   onCancel={() => {
                       voucherForm.resetFields()
                       setIsAddOrUpdate(false)
                   }}
            >
                <Form
                    form={voucherForm}
                    name="voucherForm"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 18}}
                    onFinish={handleAddOrUpdate}
                >
                    <Form.Item
                        name="id"
                        hidden={true}>
                    </Form.Item>
                    <Form.Item
                        label="Nhập tên voucher : "
                        name="name"
                        rules={[
                            {required: true, message: 'Please input voucher name!'},
                            {min: 4, message: 'voucher name must have a minimum of 4 characters!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    {
                        !isCreate &&
                        <Form.Item
                            label="Nhập mã voucher : "
                            name="code"
                            rules={[
                                {required: true, message: 'Please input code!'},
                            ]}>
                            <Input
                                style={{width: 300}}
                                type="text"
                            />
                        </Form.Item>
                    }
                    <Form.Item
                        label="Nhập giá trị : "
                        name="value"
                        rules={[
                            {required: true, message: 'Please input value!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="number"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nhập số lượng : "
                        name="quantity"
                        rules={[
                            {required: true, message: 'Please input quantity!'}
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="number"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nhập trạng thái : "
                        name="status">
                        <Select
                            style={{width: 200}}
                            options={STATUS_OPTIONS}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nhập ngày bắt đầu : "
                        name="voucherStartDate"
                        getValueProps={(i) => ({value: dayjs(i, "DD-MM-YYYY HH:mm:ss")})}
                    >
                        <DatePicker
                            style={{width: 200}}
                            format="DD-MM-YYYY HH:mm:ss"
                            onChange={(value) => {
                                return voucherForm.setFieldsValue({
                                    voucherStartDate: dayjs(value).format("DD-MM-YYYY HH:mm:ss")
                                })
                            }}
                            showTime/>
                    </Form.Item>
                    <Form.Item
                        label="Nhập ngày hết hạn : "
                        name="voucherExpirationDate"
                        getValueProps={(i) => ({value: dayjs(i, "DD-MM-YYYY HH:mm:ss")})}
                    >
                        <DatePicker
                            style={{width: 200}}
                            format="DD-MM-YYYY HH:mm:ss"
                            onChange={(value) => {
                                return voucherForm.setFieldsValue({
                                    voucherExpirationDate: dayjs(value).format("DD-MM-YYYY HH:mm:ss")
                                })
                            }}
                            showTime/>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 15,
                            span: 16,
                        }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{margin: 5}}>
                            Submit
                        </Button>
                        <Button
                            htmlType="button"
                            style={{margin: 5}}
                            onClick={() => {
                                voucherForm.resetFields()
                                setIsAddOrUpdate(false)
                            }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal width="800px"
                   open={isAddVoucher}
                   onOk={handleAddVoucherForCus}
                   onCancel={() => setIsAddVoucher(false)}
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
                    dataSource={customerList}
                    pagination={false}
                    bordered
                    style={{
                        minHeight: 500
                    }}
                />
            </Modal>
        </div>

    )
}

export default Voucher