import {AppstoreOutlined} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";

const NavigationComponent = () => {
    const navigate = useNavigate();

    function getItem(label, key, icon, children, type, path) {
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
            getItem('Quản lý User', '/user'),
            getItem('Quản lý Customer', '/customer'),
        ]),
        getItem('Quản lý voucher', '/voucher'),
        getItem('Quản lý sản phẩm', '/product'),
        getItem('Giỏ hàng', '/cart'),
        getItem('Quản lý đơn hàng', '/orders'),
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

        <Menu
            onClick={onClick}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub2']}
            mode="inline"
            items={items}
        />
    )
}
export default NavigationComponent;