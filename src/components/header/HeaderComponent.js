import React, {useEffect, useState} from 'react';
import {UploadOutlined, UserOutlined} from '@ant-design/icons';
import {Dropdown, Space, Layout, Input, Upload, Button, Image, Modal, DatePicker, Form, Select} from 'antd';
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
    const [getUserLogin, setUserLogin] = useState({});
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const customer = useSelector((state) => state.customer.customer);
    const [customerForm] = Form.useForm();
    const [urlImage, setUrlImage] = useState('')
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

    const handleAddOrUpdate = async (values) => {
        const res = await dispatch(addOrUpdateCustomer(values))
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
    useEffect(() => {
        if (isLoggedIn) {
            const [header, payload, signature] = isLoggedIn.split('.');
            setUserLogin(JSON.parse(atob(payload)))
        }
        customerForm.setFieldsValue(customer)
        setUrlImage(customer.urlImage)
    }, [customer, isLoggedIn]);

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
                   footer={null}
                   onCancel={() => {
                       setIsAddOrUpdate(false)
                       setUrlImage('')
                       customerForm.resetFields()
                   }}>
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
                            {min: 10, message: 'number phone must have a minimum of 10 characters!'},
                        ]}>
                        <Input
                            style={{width: 300}}
                            type="number"
                        />
                    </Form.Item>
                    <Form.Item
                        label=" Nhập email : "
                        name="email"
                        rules={[
                            {type: 'email', message: 'Please enter a valid email!'},
                        ]}>
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
                        label="Nhập ngày sinh : "
                        name="dateOfBirth"
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
                        name="status"
                        hidden={true}>
                    </Form.Item>
                    <Form.Item
                        label="Điểm thưởng : "
                        name="loyaltyPoints">
                        <span style={{
                            fontSize: 20,
                            marginLeft: 10
                        }}>{customerForm.getFieldValue("loyaltyPoints") || 0}
                        </span>
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{margin: 5}}>
                            Submit
                        </Button>
                        <Button
                            style={{margin: 5}}
                            htmlType="button"
                            onClick={() => {
                                setIsAddOrUpdate(false)
                                setUrlImage('')
                                customerForm.resetFields()
                            }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Header>
    )
}
export default HeaderComponent;
