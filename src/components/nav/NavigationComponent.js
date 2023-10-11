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
            getItem('Quản lý Customer', '6'),
        ]),
        getItem('Quản lý sản phẩm', '7',null,null,null,'/product'),
        getItem('Quản lý đơn hàng', '8'),
        getItem('Quản lý bài viết', '9'),
        getItem('Quản lý voucher', '10',null,null,null,'/voucher'),
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
    const onClick = (e) => {
        const item = items.find((item) => item.key === e.key);
        console.log(item)
        if (item && item.path) {
            navigate(item.path);
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