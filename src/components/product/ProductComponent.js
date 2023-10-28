import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    addOrUpdateProduct,
    deleteProduct,
    getAllProduct,
} from "../../redux/thunk/ProductThuck";
import {
    addImage,
    deleteImageOfProduct,
    getImageByProductId,
    setPriorityImage
} from "../../redux/thunk/ImageThunk";
import {Image, Button, Input, Modal, Pagination, Select, Table, Upload} from 'antd';
import {toast} from "react-toastify";
import {CheckOutlined, DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import {storage} from "../../env/FirebaseConfig";
import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import {clearImages} from "../../redux/slice/ImageSlince";

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
            title: 'Hình ảnh',
            key: 'images',
            width: 160,
            render: (text) => {
                const image = text.images.find(data => data.priority === 1);
                if (image) {
                    return <Image style={{width: 140, height: 140, borderRadius: 10}} src={image.urlImage}/>;
                }
            }
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
            width: 100
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'price',
            width: 100
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 130,
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
            fixed: 'right',
            render: (record) => (
                <span>
                    <Button style={{marginLeft: 5, marginBottom: 5, width: 100}} type="primary"
                            onClick={() => openAddOrUpdate(record)}>Edit</Button>
                    <Button style={{marginLeft: 5, marginBottom: 5, width: 100}} type="primary"
                            onClick={() => handleDelete(record)} danger>Delete</Button>
                    <Button style={{
                        marginLeft: 5,
                        marginBottom: 5,
                        width: 100,
                        backgroundColor: record.status === 1 ? "#00CC00" : ""
                    }}
                            type="primary"
                            onClick={() => addToCart(record)} disabled={record.status !== 1}>Add To Cart</Button>
                </span>
            ),
            width: 130
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
    const cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || []
    const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState({
        page: 1,
        size: 5,
        name: '',
        status: 0,
        type: 0
    });
    const productList = useSelector((state) => state.product.products);
    const oldImages = useSelector((state) => state.image.images);
    const [newImages, setNewImages] = useState([])
    const [images, setImages] = useState([])
    const addToCart = (productOfCart) => {
        const product = cartItems && cartItems.find(item => item.id === productOfCart.id)
        if (product) {
            product.quantity += 1;
            product.totalPrice += productOfCart.price;
        } else {
            cartItems.push({...productOfCart, quantity: 1, totalPrice: productOfCart.price})
        }
        sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
        toast.success('Thêm vào giỏ hàng thành công!', {
            className: 'my-toast',
            position: "top-center",
            autoClose: 2000,
        });
    }

    const openAddOrUpdate = (record) => {
        setNewImages([])
        setIsAddOrUpdate(true)
        if (record) {
            dispatch(getImageByProductId(record.id))
            setIsCreate(false)
            setProduct(record);
        } else {
            dispatch(clearImages())
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
    const handleDelete = async (record) => {
        const res = await dispatch(deleteProduct(record.id))
        if (res.code === 200) {
            toast.success('Xóa Sản phẩm thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Không thể xóa , đã có lỗi xảy ra!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }

    };
    const onSearch = async (value) => {
        const newParams = {...params, name: value}
        setParams(newParams)
        dispatch(getAllProduct(newParams))
    };
    const handleAddOrUpdate = async () => {
        const data = {...product, images: images}
        const res = await dispatch(addOrUpdateProduct(data))
        if (res.code === 200 && isCreate) {
            toast.success('Thêm Sản phẩm thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 200 && !isCreate) {
            toast.success('Sửa Sản phẩm thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            setIsAddOrUpdate(false);
            setIsLoading(!isLoading)
        }
        if (res.code === 400) {
            toast.error('Thêm Sản phẩm thất bại!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
    }
    const onDeleteImage = async (id) => {
        const res = await dispatch(deleteImageOfProduct(id))
        if (res.data.code === 200) {
            toast.success('Xóa ảnh thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            dispatch(getImageByProductId(product.id))
            setIsLoading(!isLoading)
        }
    }
    const onSetPriorityImage = async (id) => {
        const res = await dispatch(setPriorityImage(id, product.id))
        if (res.data.code === 200) {
            toast.success('Chọn ảnh thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
            dispatch(getImageByProductId(product.id))
            setIsLoading(!isLoading)
        }
    }

    const handlePageChange = (e) => {
        const newParams = {...params, page: e}
        setParams(newParams)
        dispatch(getAllProduct(newParams))

    }
    useEffect(() => {
        dispatch(getAllProduct(params))
    }, [isLoading])

    useEffect(() => {
        setImages([...oldImages, ...newImages])
    }, [oldImages, newImages])

    const handleUpload = async ({file, onSuccess, onError}) => {
        if (product == null) {
            toast.success('Thêm ảnh thành công!', {
                className: 'my-toast',
                position: "top-center",
                autoClose: 2000,
            });
        }
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
                        const res = await dispatch(addImage({
                                id: null,
                                name: null,
                                urlImage: url,
                                priority: 0
                            }
                        ))
                        if (res.code === 200) {
                            toast.success('Thêm ảnh thành công!', {
                                className: 'my-toast',
                                position: "top-center",
                                autoClose: 2000,
                            });
                            setNewImages([...newImages, res.data])
                        }
                    });
                }
            );
        } catch (error) {
            onError(error);
        }
    };
    return (
        <div>
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
                    <Button onClick={() => openAddOrUpdate(null)}
                            type="primary"
                            style={{
                                backgroundColor: "#00CC00",
                                minHeight: 32
                            }}> Thêm sản phẩm </Button>
                </div>
            </div>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={productList.content}
                pagination={false}
                bordered
                style={{
                    minHeight: 700
                }}
                scroll={{
                    x: 950
                }}
            />
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
                        defaultValue={isCreate ? 1 : product.type}
                        onChange={(e) => setProduct({...product, type: e})}
                        options={TYPE_OPTIONS}
                    />
                    <Upload customRequest={handleUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined/>}>Upload</Button>
                    </Upload>
                </div>
                {images && images.map(item => (
                    <div style={{position: 'relative', display: 'inline-block', margin: 10}} key={item.id + 1}>
                        <Image src={item.urlImage}
                               style={{
                                   width: 135,
                                   height: 135,
                                   borderRadius: 10,
                                   border: item.priority === 1 ? '2px solid #00CC00' : ''
                               }}/>
                        <DeleteOutlined
                            style={{
                                position: 'absolute',
                                top: 5,
                                right: 2,
                                fontSize: 22,
                                color: 'red',
                                cursor: 'pointer',
                            }}
                            onClick={() => onDeleteImage(item.id)}
                        />
                        {!newImages.find(value => value.id === item.id) &&
                            <CheckOutlined
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 30,
                                    fontSize: 22,
                                    color: '#00CC00',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onSetPriorityImage(item.id)}
                            />}
                    </div>
                ))
                }
            </Modal>
        </div>

    )

}
export default ProductComponent;