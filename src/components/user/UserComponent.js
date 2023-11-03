import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Form, Input, Modal, Pagination, Select, Table} from 'antd';
import {getAllUser, registerUser, updateUser} from "../../redux/thunk/UserThunk";
import {toast} from "react-toastify";
import {deleteVoucher} from "../../redux/thunk/VoucherThunk";
import dayjs from "dayjs";

const {Search} = Input;
const UserComponent = () => {
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 160
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
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
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            width: 120,
            render: (listRoles) => (
                <span>
            {listRoles.map((role, index) => (
                <span key={index} style={{marginRight: 5}}>
                    {role.name + " , "}
                </span>
            ))}
                </span>
            ),
        },
        {
            title: 'Ngày khởi tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 110
        },
        {
            title: ' Ngày chỉnh sửa',
            dataIndex: 'modifiedDate',
            key: 'modifiedDate',
            width: 110
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            fixed: 'right',
            align: 'center',
            render: (text, record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => openAddOrUpdate(record)}>Edit</Button>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => handleDelete(record)} danger>Delete</Button>
                </span>
            ),
            width: 140
        },
    ];

    const STATUS_OPTIONS = [
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không hoạt động'},
        {value: 3, label: 'Không xác định'},
    ];
    const ROLES_OPTIONS = [
        {value: 'ROLE_USER', label: 'ROLE_USER'},
        {value: 'ROLE_ADMIN', label: 'ROLE_ADMIN'},
    ]

    const dispatch = useDispatch();
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0
    });
    const userList = useSelector((state) => state.user.users);
    const [userForm] = Form.useForm();
    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            userForm.setFieldsValue({
                id: record.id,
                username: record.username,
                numberPhone: record.numberPhone,
                password: record.password,
                roles: record.roles.map(value => value.name),
                status: record.status,
            });
            setIsCreate(false)
        } else {
            userForm.setFieldsValue({
                roles: ["ROLE_USER"],
                status: 1
            });
            setIsCreate(true)
        }
    };

    const onSearch = async (value) => {
        const newParams = {...params, search: value}
        setParams(newParams)
        dispatch(getAllUser(newParams))
    };
    const handleAdd = async () => {
        const res = await dispatch(registerUser(userForm.getFieldsValue()))
        if (res.code === 200) {
            toast.success('Thêm tài khoản thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }else {
            toast.error('Thêm tài khoản thất bại! đã có lỗi xảy ra', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }
    const handleDelete = async () => {
    };
    const handleUpdate = async () => {
        const res = await dispatch(updateUser(userForm.getFieldsValue()))
        if (res.code === 200) {
            toast.success('Cập nhập tài khoản thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }else {
            toast.error('Cập nhập tài khoản thất bại! đã có lỗi xảy ra', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handlePageChange = (e) => {
        const newParams = {...params, page: e}
        setParams(newParams)
        dispatch(getAllUser(newParams))

    }
    const validatePassword = (_, value) => {
        if (!value || userForm.getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject('Password incorrect!');
    };

    useEffect(() => {
        dispatch(getAllUser(params))
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
                        placeholder="Nhập username hoặc số điện thoại"
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
                            }}> Thêm người dùng</Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={userList.content}
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
                total={userList.totalElements}
                onChange={handlePageChange}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
            <Modal title={isCreate ? "Thêm tài khoản mới" : "Chỉnh sửa thông tin"} open={isAddOrUpdate}
                   footer={null}
                   onCancel={() => {
                       setIsAddOrUpdate(false)
                       userForm.resetFields()
                   }}>
                <Form
                    form={userForm}
                    onFinish={isCreate ? handleAdd : handleUpdate}
                    name="user"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 12}}>
                    <Form.Item
                        name="id"
                        hidden={true}/>
                    <Form.Item
                        label="Nhập tên tài khoản : "
                        name="username"
                        rules={[
                            {required: true, message: 'Please input username!'},
                            {min: 4, message: 'username must have a minimum of 6 characters!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="text"
                            disabled={!isCreate}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nhập số điện thoại : "
                        name="numberPhone"
                        rules={[
                            {required: true, message: 'Please input number phone!'},
                            {min: 10, message: 'number phone must have a minimum of 10 characters!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="number"
                        />
                    </Form.Item>
                    {isCreate &&
                        <>
                            <Form.Item
                                label="Nhập mật khẩu : "
                                name="password"
                                rules={[
                                    {required: true, message: 'Please input password!'},
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                                        message: 'Password must have at least 1 uppercase letter, 1 lowercase letter and at least 6 characters',
                                    },
                                ]}>
                                <Input.Password
                                    style={{width: 300}}
                                    type="text"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Xác nhận mật khẩu : "
                                name="confirmPassword"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!'
                                    },
                                    {
                                        validator: validatePassword
                                    },
                                ]}>
                                <Input.Password
                                    style={{width: 300}}
                                    type="text"
                                />
                            </Form.Item>
                        </>
                    }
                    <Form.Item
                        label="Nhập roles : "
                        name="roles"
                        rules={[
                            {required: true, message: 'Please input roles!'},
                        ]}>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{width: 300}}
                            options={ROLES_OPTIONS}
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
                        <Button htmlType="button"
                                style={{margin: 5}}
                                onClick={() => {
                                    setIsAddOrUpdate(false)
                                    userForm.resetFields()
                                }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>

    )
}
export default UserComponent;