import {Button, DatePicker, Input, Modal, Pagination, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {addOrUpdateVoucher, getAllVoucher} from "../../redux/thunk/VoucherThunk";
import moment from "moment";

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
            width: 120,
        },
        {
            title: 'Ngày có hết hạn',
            dataIndex: 'voucherExpirationDate',
            key: 'voucherExpirationDate',
            width: 120,
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            render: (text, record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => openAddOrUpdate(record)}>Edit</Button>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => handleDelete(record)} danger>Delete</Button>
                </span>
            ),
            width: 160
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Đã sử dụng'},
    ];

    const dispatch = useDispatch();
    const [voucher, setVoucher] = useState({})
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isSaveSuccess , setIsSaveSuccess] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        name: '',
        code: '',
        status: 0,
        ascOrDesc: ''
    });
    const voucherList = useSelector((state) => state.voucher.data);

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
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setVoucher({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        await setParams({...params, name: value})
        await dispatch(getAllVoucher(params.page, params.size, value, params.code, params.status, params.ascOrDesc))
    };
    const handleAddOrUpdate = () => {
        const res = dispatch(addOrUpdateVoucher(voucher))
        if(res.data.code===200){
            setIsSaveSuccess(res)
        }
    }

    const handlePageChange = (e) => {
        setParams({...params, page: e})
        dispatch(getAllVoucher(e, params.size, params.name, params.code, params.status, params.ascOrDesc))

    }
    useEffect(() => {
        setIsAddOrUpdate(false);
        dispatch(getAllVoucher(params.page, params.size, params.name, params.code, params.status, params.ascOrDesc))
    }, [isSaveSuccess])
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
                    minHeight:600
                }}
                scroll={{
                    x:1100
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
                    <Select
                        key={voucher.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        defaultValue={isCreate ? 1 : voucher.status}
                        onChange={(e) => setVoucher({...voucher, status: e})}
                        options={STATUS_OPTIONS}
                    />
                    <DatePicker
                        value={voucher.voucherStartDate ? moment(voucher.voucherStartDate, "DD-MM-YYYY HH:mm:ss") : null}
                        onChange={(e) => {setVoucher({...voucher, voucherStartDate: e && e.format("DD-MM-YYYY HH:mm:ss")})
                        }}
                        showTime/>
                    <DatePicker
                        value={voucher.voucherExpirationDate ? moment(voucher.voucherExpirationDate, "DD-MM-YYYY HH:mm:ss") : null}
                        onChange={(e) => setVoucher({...voucher, voucherExpirationDate: e && e.format("DD-MM-YYYY HH:mm:ss")})}
                        showTime/>
                </div>
            </Modal>
        </div>

    )
}

export default VoucherComponent