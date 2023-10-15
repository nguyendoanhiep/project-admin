import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addOrUpdateProduct, getAllProduct} from "../../redux/thunk/ProductThuck";
import {Button, Input, Modal, Pagination, Select, Table} from 'antd';

const {TextArea, Search} = Input;
const ProductComponent = () => {
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            width: 180
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 140
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
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
            title: 'Phân loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (text) => {
                switch (text) {
                    case 1:
                        return 'Loại 1'
                    case 2:
                        return 'Loại 2';
                    case 3:
                        return 'Loại 3';
                    default:
                        return 'Không rõ';
                }
            },
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

    const TYPE_OPTIONS = [
        {value: 1, label: 'Loại 1'},
        {value: 2, label: 'Loại 2'},
        {value: 3, label: 'Loại 3'},
    ];


    const dispatch = useDispatch();
    const [product, setProduct] = useState({})
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [params, setParams] = useState({
        page: 1,
        size: 10,
        name: '',
        status: 0,
        type: 0
    });
    const productList = useSelector((state) => state.product.data);
    const isSaveData = useSelector((state) => state.product.isSaveData)

    const openAddOrUpdate = (record) => {
        setIsAddOrUpdate(true)
        if (record) {
            setIsCreate(false)
            setProduct(record);
        } else {
            setIsCreate(true)
            setProduct({
                status: 1,
                type: 2
            });
        }


    };
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setProduct({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        setParams({...params, name: value})
        dispatch(getAllProduct(params.page, params.size, value, params.status, params.type))
    };
    const handleAddOrUpdate = async () => {
        await dispatch(addOrUpdateProduct(product))
    }

    const handlePageChange = (e) => {
        setParams({...params, page: e})
        dispatch(getAllProduct(e, params.size, params.name, params.status, params.type))

    }
    useEffect(() => {
        setIsAddOrUpdate(false);
        dispatch(getAllProduct(params.page, params.size, params.name, params.status, params.type))
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
                    <Select
                        placeholder="Select a type"
                        options={TYPE_OPTIONS}
                        onChange={(e) => setParams({...params, type: e})}
                    />
                    <Search
                        placeholder="Nhập tên sản phẩm"
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
                            }
                            }> Thêm sản phẩm </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                style={{
                    minHeight: 600
                }}
                columns={columns}
                dataSource={productList.content}
                pagination={false} bordered/>
            <Pagination
                current={params.page}
                pageSize={params.size}
                total={productList.totalElements}
                onChange={handlePageChange}
                style={{
                    minWidth: 200,
                    float: "right",
                    margin: 15,
                    alignSelf: 'flex-end'
                }}/>
            <Modal title={isCreate ? "Thêm mới sản phẩm" : "Chỉnh sửa sản phẩm"} open={isAddOrUpdate}
                   onOk={handleAddOrUpdate}
                   onCancel={closeAddOrUpdate}>
                <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Tên sản phẩm"
                        value={product.name || ''}
                        onChange={(e) => setProduct({...product, name: e.target.value})}
                    />
                    <TextArea
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Mô tả"
                        value={product.description || ''}
                        onChange={(e) => setProduct({...product, description: e.target.value})}
                    />
                    <Input
                        style={{width: 350, marginTop: 10, marginBottom: 10}}
                        type="text"
                        placeholder="Giá tiền"
                        value={product.price || ''}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                    />
                    <Select
                        key={product.id}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        defaultValue={isCreate ? 1 : product.status}
                        onChange={(e) => setProduct({...product, status: e})}
                        options={STATUS_OPTIONS}
                    />
                    <Select
                        key={product.id + 1}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        defaultValue={isCreate ? 1 : product.type }
                        onChange={(e) => setProduct({...product, type: e})}
                        options={TYPE_OPTIONS}
                    />
                </div>

            </Modal>
        </div>

    )
}
export default ProductComponent;