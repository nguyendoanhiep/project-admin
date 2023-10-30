import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, Image, Input, Modal, Pagination, Select, Table, Upload} from 'antd';
import {addOrUpdateCustomer, getAllCustomer} from "../../redux/thunk/CustomerThunk";
import {toast} from "react-toastify";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../env/FirebaseConfig";
import {UploadOutlined} from "@ant-design/icons";

const {Search} = Input;
const CustomerComponent = () => {
    const columns = [
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
            title: ' Địa chỉ ',
            dataIndex: 'address',
            key: 'address',
            width: 120
        },
        {
            title: 'Điểm thưởng',
            dataIndex: 'loyaltyPoints',
            key: 'loyaltyPoints',
            width: 100
        },
        {
            title: ' Ảnh đại diện',
            key: 'image.urlImage',
            width: 100,
            render: (text) => {
                return <Avatar style={{width: 80, height: 80}} src={text && text.urlImage}/>
            }
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
        {value: 3, label: 'Không xác định'},
    ];
    const customerList = useSelector((state) => state.customer.customers);
    const dispatch = useDispatch();
    const [customer, setCustomer] = useState({})
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0
    });


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
        const newParams = {...params, search: value}
        setParams(newParams)
        dispatch(getAllCustomer(newParams))
    };
    const handleAddOrUpdate = async () => {
        const res = await dispatch(addOrUpdateCustomer(customer))
        if (res.code === 200) {
            toast.success(isCreate ?'Thêm Khách hàng thành công!' : 'Cập nhập thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error(isCreate ? 'Đã có lỗi xảy ra , không thể thêm mới !' : 'Đã có lỗi xảy ra , không thể cập nhập !' , {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handlePageChange = (e) => {
        const newParams = {...params, page: e}
        setParams(newParams)
        dispatch(getAllCustomer(newParams))

    }

    const handleUpload = async ({file, onSuccess, onError}) => {
        const storageRef = ref(storage, "images/" + file.name);
        try {
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    onError(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        onSuccess();
                        setCustomer({...customer, urlImage: url})
                    });
                }
            );
        } catch (error) {
            onError(error);
        }
    };

    useEffect(() => {
        dispatch(getAllCustomer(params))
    }, [isLoading])

    return (
        <div>
            <div style={{display: 'flex', justifyContent: ' space-between'}}>
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
                            }}> Thêm khách hàng </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={customerList.content}
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
                        placeholder="Email"
                        value={customer.email || ''}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Địa chỉ"
                        value={customer.address || ''}
                        onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Điểm thưởng"
                        value={customer.loyaltyPoints || ''}
                        onChange={(e) => setCustomer({...customer, loyaltyPoints: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Ngày sinh"
                        value={customer.dateOfBirth || ''}
                        onChange={(e) => setCustomer({...customer, dateOfBirth: e.target.value})}
                    />
                    <Select
                        key={customer.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        value={customer.status ? customer.status : 1}
                        onChange={(e) => setCustomer({...customer, status: e})}
                        options={STATUS_OPTIONS}
                    />
                    <Upload customRequest={handleUpload} showUploadList={false} >
                        <Button icon={<UploadOutlined/>}>Upload</Button>
                    </Upload>
                    {customer.urlImage &&
                        <div style={{marginTop:10}}>
                            <Image src={customer.urlImage}
                                   style={{
                                       width: 135,
                                       height: 135,
                                       borderRadius: 10,
                                   }}/>
                        </div>
                    }
                </div>
            </Modal>
        </div>
    )
}
export default CustomerComponent;