import React, {useEffect, useState} from 'react';
import {UploadOutlined, UserOutlined} from '@ant-design/icons';
import {Dropdown, Space, Layout, Input, Upload, Button, Image, Modal, DatePicker} from 'antd';
import logo from '../../env/img/logo.png'
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {toast} from "react-toastify";
import {logout} from '../../redux/slice/UserSlince';
import {addOrUpdateCustomer, findCustomerById} from "../../redux/thunk/CustomerThunk";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../env/FirebaseConfig";
import dayjs from "dayjs";
const {Header} = Layout;

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = JSON.parse(localStorage.getItem('Token'));
    const [getUserLogin , setUserLogin] = useState({});
    const [customer, setCustomer] = useState({})
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const getCustomer = useSelector((state) => state.customer.customer);

    const handleLogout = () => {
        dispatch(logout());
        toast.error('Đăng xuất thành công!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'my-toast'
        });
        navigate('/');
    };
    const openAddOrUpdate = async () => {
        setIsAddOrUpdate(true)
        await dispatch(findCustomerById(getUserLogin.id))
    };
    const items = [
        {
            label: 'Edit Profile',
            key: '0',
            onClick: openAddOrUpdate
        },
        {
            type: 'divider',
        },
        {
            label: 'Log Out',
            key: '3',
            onClick: handleLogout
        },
    ];
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

    const handleAddOrUpdate = async () => {
        const res = await dispatch(addOrUpdateCustomer(customer))
        if (res.code === 200) {
            toast.success('Cập nhập thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
        }
        if (res.code === 400) {
            toast.error('Đã có lỗi xảy ra , không thể cập nhập !', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setCustomer({})
    }

    useEffect(() => {
        if(isLoggedIn){
            const [header, payload, signature] = isLoggedIn.split('.');
            setUserLogin(JSON.parse(atob(payload)))
        }
        setCustomer(getCustomer)
    }, [getCustomer,isLoggedIn]);

    return (
        <Header className='container' style={{
            marginBottom: '40px',
            height: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
        }}>
            <div className="logo">
                <img src={logo} alt="Logo" style={{width: '100px', height: '50px'}}/>
            </div>
            {isLoggedIn ?
                <Dropdown
                    menu={{items}}>
                    <Link onClick={(e) => e.preventDefault()}>
                        <Space style={{color: 'black'}}>
                            <UserOutlined/>
                            Profile
                        </Space>
                    </Link>
                </Dropdown> :
                <Link to="/login" style={{color: 'black', fontSize: '16px'}}>Login</Link>
            }
            <Modal title="Chỉnh sửa thông tin" open={isAddOrUpdate}
                   onOk={handleAddOrUpdate}
                   onCancel={closeAddOrUpdate}>
                <div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <div> Nhập họ tên :</div>
                        <Input
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={customer.name || ''}
                            onChange={(e) => setCustomer({...customer, name: e.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span> Nhập Số điện thoại : </span>
                        <Input
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={customer.numberPhone || ''}
                            onChange={(e) => setCustomer({...customer, numberPhone: e.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span> Nhập Email : </span>
                        <Input
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={customer.email || ''}
                            onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span> Nhập địa chỉ : </span>
                        <Input
                            style={{width: 300, marginTop: 10, marginBottom: 10}}
                            type="text"
                            value={customer.address || ''}
                            onChange={(e) => setCustomer({...customer, address: e.target.value})}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center"}}>
                        <span>Nhập ngày sinh : </span>
                        <DatePicker
                            style={{width: 300, marginTop: 10, marginBottom: 10,}}
                            value={customer.dateOfBirth ? dayjs(customer.dateOfBirth , "DD-MM-YYYY")  : null}
                            onChange={(e) => setCustomer({
                                ...customer, dateOfBirth: e && e.format("DD-MM-YYYY")
                            })}/>
                    </div>
                    <div style={{width: 300, marginTop: 10, marginBottom: 10}}>
                        <p>Điểm thưởng : <span style={{fontSize: 20 , marginLeft:10}}>{customer.loyaltyPoints || ''}</span></p>
                    </div>
                    <div style={{display: "flex", justifyContent: 'center'}}>
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}>
                            <Button icon={<UploadOutlined/>}>Upload</Button>
                        </Upload>
                    </div>
                    {customer.urlImage &&
                        <div style={{marginTop: 15, display: "flex", justifyContent: 'center'}}>
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
        </Header>
    )
}
export default HeaderComponent;
