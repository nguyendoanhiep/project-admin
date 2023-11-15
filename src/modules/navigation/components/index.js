import {
    AppstoreOutlined, BankOutlined, DollarOutlined, FundOutlined,
    HomeOutlined, LineChartOutlined,
    OrderedListOutlined, ShopOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";

const Navigation = () => {
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
        getItem('Trang chủ', '/', <HomeOutlined style={{fontSize: 18}}/>),

        getItem('Quản trị người dùng', 'sub2', <AppstoreOutlined style={{fontSize: 18}}/>, [
            getItem('Quản lý User', '/user', <UserOutlined style={{fontSize: 18}}/>),
            getItem('Quản lý Customer', '/customer', <TeamOutlined style={{fontSize: 18}}/>),
        ]),
        getItem('Quản lý voucher', '/voucher', <DollarOutlined style={{fontSize: 18}}/>),
        getItem('Quản lý sản phẩm', '/product', <ShopOutlined style={{fontSize: 18}}/>),
        getItem('Giỏ hàng', '/cart', <ShoppingCartOutlined style={{fontSize: 18}}/>),
        getItem('Quản lý đơn hàng', '/orders', <OrderedListOutlined style={{fontSize: 18}}/>),
        getItem('Báo cáo doanh thu', '11', <LineChartOutlined style={{fontSize: 18}}/>, [
            getItem('Doanh thu tháng', '12', <FundOutlined style={{fontSize: 18}}/>),
            getItem('Doanh thu quý', '13', <FundOutlined style={{fontSize: 18}}/>),
            getItem('Doanh thu năm', '14', <FundOutlined style={{fontSize: 18}}/>)
        ]),
        getItem('Kho hàng', '15', <BankOutlined style={{fontSize: 18}}/>),
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
export default Navigation;