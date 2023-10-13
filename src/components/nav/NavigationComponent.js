import {AppstoreOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {useEffect} from "react";
import {useLocation , useNavigate} from "react-router-dom";

const NavigationComponent = () => {
    const location = useLocation();
    const isLoggedIn = JSON.parse(localStorage.getItem('Token'));
    const navigate = useNavigate();

    useEffect(() => {
    }, [location])

    function getItem(label, key, icon, children, type,path) {
        return {
            key,
            icon,
            children,
            label,
            type,
            path
        };
    }

    const items = [
        {
            type: 'divider',
        },
        getItem('Quản trị người dùng', 'sub2', <AppstoreOutlined/>, [
            getItem('Quản lý User', '5'),
            getItem('Quản lý Customer', '/customer',null,null,null,),
        ]),
        getItem('Quản lý sản phẩm', '/product',null,null,null,),
        getItem('Quản lý đơn hàng', '8'),
        getItem('Quản lý bài viết', '9'),
        getItem('Quản lý voucher', '/voucher',null,null,null),
        getItem('Báo cáo doanh thu', '11', null, [
            getItem('Doanh thu tháng', '12'),
            getItem('Doanh thu quý', '13'),
            getItem('Doanh thu năm', '14')
        ]),
        getItem('Kho hàng', '15'),
        {
            type: 'divider',
        },
    ];
    const onClick = (item) => {
        if (item && item.keyPath[0]) {
            navigate(item.keyPath[0]);
        }
    };
    return (
        isLoggedIn ?
            <div style={{minWidth: 280}}>
                <Menu
                    onClick={onClick}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub2']}
                    mode="inline"
                    items={items}
                />
            </div>
            :
            <></>
    )
}
export default NavigationComponent;