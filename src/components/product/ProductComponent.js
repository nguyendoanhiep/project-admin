import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addOrUpdateProduct, getAllProduct} from "../../redux/thunk/ProductThuck";
import {Button, Input, Modal, Pagination, Select, Table} from 'antd';
import {SearchOutlined} from "@ant-design/icons";

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
            width: 140
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (text) => {
                switch (text) {
                    case 0:
                        return <span className='status-inactive'>Không hoạt động</span>
                    case 1:
                        return <span className='status-active'>Đang hoạt động</span>
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
        {value: 0, label: 'Không hoạt động'},
        {value: 1, label: 'Đang hoạt động'},
        {value: 2, label: 'Không xác định'},
    ];

    const TYPE_OPTIONS = [
        {value: 1, label: 'Loại 1'},
        {value: 2, label: 'Loại 2'},
        {value: 3, label: 'Loại 3'},
    ];


    const dispatch = useDispatch();
    const [product, setProduct] = useState({
    })
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
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
            console.log(product)
        }


    };
    const closeAddOrUpdate = () => {
        setIsAddOrUpdate(false)
        setProduct({})
    }
    const handleDelete = (record) => {
    };
    const onSearch = async (value) => {
        await dispatch(getAllProduct(page, size, value))
    };
    const handleAddOrUpdate = async () => {
        await dispatch(addOrUpdateProduct(product))
        if (isSaveData) {
            console.log('isSaveData', isSaveData)
            setIsAddOrUpdate(false);
            await dispatch(getAllProduct(page, size, ""))
        }
    }

    const handlePageChange = (e) => {
        setPage(e)
        console.log('input page', e)
        console.log('page', page)
        dispatch(getAllProduct(e, size, ""))

    }
    useEffect(() => {
        dispatch(getAllProduct(page, size, ""))
    }, [])
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
                    />
                    <Select
                        placeholder="Select a type"
                        options={TYPE_OPTIONS}
                    />
                    <Search
                        placeholder="Nhập tên sản phẩm"
                        allowClear
                        style={{
                            width: 250,
                            marginBottom: 20
                        }}

                    />

                    {/*<Button icon={<SearchOutlined/>} onClick={onSearch}/>*/}
                </div>
                <div>
                    <Button onClick={() => openAddOrUpdate()}
                            type="primary"
                            style={{
                                backgroundColor:"#00CC00",
                                minHeight:32
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
                current={page}
                pageSize={size}
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
                        defaultValue={product.status ? product.status : 1}
                        onChange={(e) => setProduct({...product, status: e})}
                        options={STATUS_OPTIONS}
                    />
                    <Select
                        key={product.id + 1}
                        style={{width: 200, marginTop: 10, marginBottom: 10}}
                        defaultValue={product.type ? product.type : 2}
                        onChange={(e) => setProduct({...product, type: e})}
                        options={TYPE_OPTIONS}
                    />
                </div>

            </Modal>
        </div>

    )
}
export default ProductComponent;