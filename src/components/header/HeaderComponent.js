import React, {useEffect, useRef} from 'react';
import {UserOutlined} from '@ant-design/icons';
import {Dropdown, Space, Layout} from 'antd';
import logo from '../../env/img/logo.png'
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {toast} from "react-toastify";
import {logout} from '../../redux/slice/UserSlince';

const {Header} = Layout;

const HeaderComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = JSON.parse(localStorage.getItem('Token'));
    const isMounted = useRef(true);
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
        if (isMounted.current) {
            navigate('/');
        }
    };

    useEffect(() => {
        // Hủy mounted khi component unmounted
        return () => {
            isMounted.current = false;
        };
    }, []);
    const items = [
        {
            label: <Link to="/">Edit Profile</Link>,
            key: '0',
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
    return (
        <Header className='container' style={{
            marginBottom: '20px',
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
                        <Space style={{color:'black'}}>
                            <UserOutlined/>
                            Profile
                        </Space>
                    </Link>
                </Dropdown> :
                <Link to="/login" style={{color: 'black', fontSize: '16px'}}>Login</Link>
            }
        </Header>
    )
}
export default HeaderComponent;
