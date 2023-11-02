import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Avatar, Button, DatePicker, Form, Image, Input, Modal, Pagination, Select, Table, Upload} from 'antd';
import {addOrUpdateCustomer, getAllCustomer} from "../../redux/thunk/CustomerThunk";
import {toast} from "react-toastify";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../env/FirebaseConfig";
import {UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

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
            align: 'center',
            render: (text, record) => (
                <span>
                 <Button style={{margin: 5, width: 90}} type="primary"
                         onClick={() => openAddOrUpdate(record)}>Edit</Button>
                 <Button style={{margin: 5, width: 90}} type="primary"
                         onClick={() => handleDelete(record)} danger>Delete</Button>
                </span>
            ),
            width: 110
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Không xác định'},
    ];
    const customerList = useSelector((state) => state.customer.customers);
    const dispatch = useDispatch();
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [customerForm] = Form.useForm();
    const [urlImage, setUrlImage] = useState('')

    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0
    });


    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            customerForm.setFieldsValue(record)
            setUrlImage(record.urlImage)
            setIsCreate(false)
        } else {
            setIsCreate(true)
        }
    };
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setUrlImage('')
        customerForm.resetFields()
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        const newParams = {...params, search: value}
        setParams(newParams)
        dispatch(getAllCustomer(newParams))
    };
    const handleAddOrUpdate = async () => {
        const res = await dispatch(addOrUpdateCustomer(customerForm.getFieldsValue()));
        if (res.code === 200) {
            toast.success(isCreate ? 'Thêm Khách hàng thành công!' : 'Cập nhập thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        } else {
            toast.error(isCreate ? 'Đã có lỗi xảy ra , không thể thêm mới !' : 'Đã có lỗi xảy ra , không thể cập nhập !', {
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
                        setUrlImage(url)
                        customerForm.setFieldsValue({
                            urlImage: url
                        })
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
                   footer={null}
                   closeIcon={null}>
                <Form
                    form={customerForm}
                    onFinish={handleAddOrUpdate}
                    name="customerForm"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 18}}>
                    <Form.Item
                        name="id"
                        hidden={true}>
                    </Form.Item>
                    <Form.Item
                        label=" Nhập họ và tên : "
                        name="name"
                    >
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label=" Nhập số điện thoại : "
                        name="numberPhone"
                        rules={[
                            {required: true, message: 'Please input number phone!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label=" Nhập email : "
                        name="email">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label=" Nhập địa chỉ : "
                        name="address">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label=" Nhập điểm thưởng : "
                        name="loyaltyPoints">
                        <Input
                            style={{width: 300}}
                            type="text"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nhập ngày sinh : "
                        name="dateOfBirth"
                        initialValue={isCreate && dayjs().format("DD-MM-YYYY")}
                        getValueProps={(i) => ({value: dayjs(i ? i : dayjs(), "DD-MM-YYYY")})}
                    >
                        <DatePicker
                            style={{width: 200}}
                            format="DD-MM-YYYY"
                            onChange={(value) => {
                                return customerForm.setFieldsValue({
                                    dateOfBirth: dayjs(value).format("DD-MM-YYYY")
                                })
                            }}
                            showTime/>
                    </Form.Item>
                    <Form.Item
                        label="Nhập trạng thái : "
                        name="status"
                        initialValue={isCreate && 1}
                        rules={[
                            {required: true, message: 'Please input status!'},
                        ]}>
                        <Select
                            style={{width: 200}}
                            options={STATUS_OPTIONS}
                        />
                    </Form.Item>
                    <Form.Item
                        name="urlImage"
                        label="Tải ảnh lên">
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}>
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                    </Form.Item>
                    <div style={{display: "flex", justifyContent: 'center', margin: 10}}>
                        {
                            urlImage &&
                            <Image
                                src={urlImage}
                                style={{
                                    width: 135,
                                    height: 135,
                                    borderRadius: 10,
                                }}
                            />
                        }
                    </div>
                    <Form.Item
                        wrapperCol={{
                            offset: 15,
                            span: 16,
                        }}>
                        <Button type="primary" htmlType="submit" style={{margin: 5}}>
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={closeAddOrUpdate} style={{margin: 5}}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
export default CustomerComponent;