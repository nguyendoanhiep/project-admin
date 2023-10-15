import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Input, Modal, Pagination, Select, Table} from 'antd';
import {getAllUser, registerUser} from "../../redux/thunk/UserThunk";
import {logout} from "../../redux/slice/UserSlince";

const {Search} = Input;
const UserComponent = () => {
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 180
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'numberPhone',
            key: 'numberPhone',
            width: 140
        },
        {
            title: 'Ngày khởi tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            width: 120
        },
        {
            title: ' Ngày chỉnh sửa',
            dataIndex: 'modifiedDate',
            key: 'modifiedDate',
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
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            width: 140,
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
    const [user, setUser] = useState({})
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        search: '',
        status: 0
    });
    const userList = useSelector((state) => state.user.data);
    const isSaveData = useSelector((state) => state.user.user)

    const openAddOrUpdate = (record) => {
        setConfirmPassword("")
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            setUser(record);
        } else {
            setIsCreate(true)
            setUser({
                status: 1
            });
        }


    };
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setUser({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        setParams({...params, search: value})
        dispatch(getAllUser(params.page, params.size, value, params.status))
    };
    const handleAddOrUpdate = async () => {
        await dispatch(registerUser(user))
    }

    const handlePageChange = (e) => {
        setParams({...params, page: e})
        dispatch(getAllUser(e, params.size, params.search, params.status))

    }
    const handleConfirmPasswordChange = (e) => {
        if (user.password === e) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    };

    useEffect(() => {
        setIsAddOrUpdate(false);
        dispatch(getAllUser(params.page, params.size, params.search, params.status))
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
                style={{
                    minHeight: 600
                }}
                columns={columns}
                dataSource={userList.content}
                pagination={false} bordered/>
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
                   onOk={handleAddOrUpdate}
                   onCancel={closeAddOrUpdate}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Tên tài khoản"
                        value={user.username || ''}
                        onChange={(e) => setUser({...user, name: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Số điện thoại"
                        value={user.numberPhone || ''}
                        onChange={(e) => setUser({...user, numberPhone: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="password"
                        placeholder="Password"
                        value={user.password || ''}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                    />
                    {
                        isCreate && <Input
                            style={{width: 350, marginTop: 10, marginBottom: 10}}
                            type="password"
                            placeholder="Comfirm Password"
                            value={confirmPassword || ''}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                handleConfirmPasswordChange(e.target.value)
                            }}
                        />
                    }
                    {!passwordMatch && (
                        <p style={{color: 'red'}}>Mật khẩu và xác nhận mật khẩu không khớp.</p>
                    )}
                    <Select
                        key={user.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        value={user.status ? user.status : 1}
                        onChange={(e) => setUser({...user, status: e})}
                        options={STATUS_OPTIONS}
                    />
                </div>
            </Modal>
        </div>

    )
}
export default UserComponent;