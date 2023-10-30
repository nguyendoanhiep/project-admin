import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, Modal, Pagination, Select, Table} from 'antd';
import {getAllUser, registerUser, updateUser} from "../../redux/thunk/UserThunk";
import {toast} from "react-toastify";

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
            render: (text, record) => (
                <span>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => openAddOrUpdate(record)}>Edit</Button>
                 <Button style={{marginLeft: 5, width: 70}} type="primary"
                         onClick={() => handleDelete(record)} danger>Delete</Button>
                </span>
            ),
            width: 150
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
    const [user, setUser] = useState({})
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('')
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

    const openAddOrUpdate = (record) => {
        setConfirmPassword("")
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            setUser({...record, roles: record.roles && record.roles.map(value => value.name)});
        } else {
            setIsCreate(true)
            setUser({
                status: 1
            });
        }
    };
    const closeAddOrUpdate = () => {
        setPasswordMatch(true);
        setIsAddOrUpdate(false)
        setUser({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        const newParams = {...params, search: value}
        setParams(newParams)
        dispatch(getAllUser(newParams))
    };
    const handleAdd = async () => {
        const res = await dispatch(registerUser(user))
        if (res.code === 200) {
            toast.success('Thêm Tài khoản thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Thêm Tài khoản thất bại!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }

    const handleUpdate = async () => {
        const res = await dispatch(updateUser(user))
        if (res.code === 200) {
            toast.success('Cập nhập tài khoản thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Cập nhập tài khoản thất bại!', {
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
    const handleConfirmPasswordChange = (e) => {
        if (user.password === e) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
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
                   onOk={isCreate ? handleAdd : handleUpdate}
                   onCancel={closeAddOrUpdate}>
                <div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span>Nhập tên tài khoản : </span>
                        <Input
                            disabled={user.id}
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={user.username || ''}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span>Nhập số điện thoại : </span>
                        <Input
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={user.numberPhone || ''}
                            onChange={(e) => setUser({...user, numberPhone: e.target.value})}
                        />
                    </div>
                    {isCreate &&
                        <>
                            <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                                <span>Nhập password : </span>
                                <Input
                                    style={{width: 300, marginTop: 10, marginBottom: 10}}
                                    type="password"
                                    value={user.password || ''}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                                <span>Nhập lại password : </span>
                                <Input
                                    style={{width: 300, marginTop: 10, marginBottom: 10}}
                                    type="password"
                                    value={confirmPassword || ''}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value)
                                        handleConfirmPasswordChange(e.target.value)
                                    }}
                                />
                                {!passwordMatch && (
                                    <p style={{color: 'red'}}>Mật khẩu và xác nhận mật khẩu không khớp.</p>
                                )}
                            </div>
                        </>
                    }
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span>Phân quyền : </span>
                        <Select
                            key={user.id + 1}
                            mode="multiple"
                            allowClear
                            style={{width: 300}}
                            value={user.roles && user.roles}
                            onChange={(e) => {
                                setUser({...user, roles: e})
                            }}
                            options={ROLES_OPTIONS}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span>Chọn trạng thái : </span>
                        <Select
                            key={user.id}
                            style={{width: 200, marginTop: 10, marginBottom: 10}}
                            value={user.status ? user.status : 1}
                            onChange={(e) => setUser({...user, status: e})}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                </div>
            </Modal>
        </div>

    )
}
export default UserComponent;