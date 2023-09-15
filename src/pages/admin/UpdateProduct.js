import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();

    const { token } = useSelector(state => state.auth);

    const [categories, setCategories] = useState([]);

    const [photo, setPhoto] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [id, setId] = useState("");


    // getting single product
    const getProduct = async () => {

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params?.slug}`);
            if (data?.success) {
                setName(data?.product?.name);
                setId(data?.product?._id);
                setDescription(data?.product?.description);
                setPrice(data?.product?.price);
                setQuantity(data?.product?.quantity);

                setCategory(data?.product?.category);
                setShipping(data?.product?.shipping);
            }

        } catch (error) {
            // console.log(error);;
            toast.error("Something went wrong while getting product details.");
        }

    }


    // getting all categories
    const getAllcategory = async () => {

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }

        } catch (error) {
            // console.log(error);;
            toast.error("Something went wrong while getting category");
        }

    }

    // handling product update
    const handleUpdate = async (e) => {
        try {

            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category._id);
            productData.append("shipping", shipping);

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            })


            if (data?.success) {
                toast.success(data?.message);
                navigate('/dashboard/admin/products')
            } else {
                toast.error(data?.message);
            }

        } catch (error) {
            // console.log(error);;
            toast.error("Error while updating product");
        }
    }

    // handling product delete
    const handleDelete = async (e) => {
        try {

            let answer = window.prompt('Are you sure to delete product? (Type "Yes" if you want to delete)');
            if (answer == "Yes") {

                const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`, {
                    headers: {
                        'Authorization': token
                    }
                })


                if (data?.success) {
                    toast.success(data?.message);
                    navigate('/dashboard/admin/products')
                } else {
                    toast.error(data?.message);
                }
            }
        } catch (error) {
            // console.log(error);;
            toast.error("Error while deleting product");
        }
    }

    useEffect(() => {
        getProduct();
        // eslint-disable-next-line
        getAllcategory();
    }, [])

    return (
        <Layout title={"Dashboard- update Product"}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3"> <AdminMenu /> </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>


                        <div className="p-1 w-75">

                            <Select bordered={false} placeholder="Select a category" size='medium' showSearch className='form-select mb-2'
                                onChange={(value) => { setCategory(value) }} value={category?.name} >
                                {categories.map((cat) => (
                                    <Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>


                            <div className="mb-2">
                                <label className='btn btn-outline-primary' >
                                    {photo ? photo.name : "Update Photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                </label>
                            </div>

                            {/* this is the preview of uploaded image only when the photo is not null */}
                            <div className="mb-3">
                                {photo ? (
                                    <div className="text-center">
                                        <img src={URL.updateObjectURL(photo)} alt="Product Photo" height={'200px'} className='img img-responsive' />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt="Product Photo" height={'200px'} className='img img-responsive' />
                                    </div>
                                )}
                            </div>

                            <div className="mb-2">
                                <input type='text' value={name} placeholder='Product Name' className='form-control' onChange={(e) => { setName(e.target.value) }} />
                            </div>

                            <div className="mb-2">
                                <textarea className="form-control" value={description} placeholder="Product Description" onChange={(e) => { setDescription(e.target.value) }}></textarea>
                            </div>

                            <div className="mb-2">
                                <input type='text' value={price} placeholder='Product Price' className='form-control' onChange={(e) => { setPrice(e.target.value) }} />
                            </div>


                            <div className="mb-2">
                                <input type='text' value={quantity} placeholder='Product Quantity' className='form-control' onChange={(e) => { setQuantity(e.target.value) }} />
                            </div>

                            {/* this is for selecting the shipping of new product we r adding */}
                            <Select bordered={false} placeholder="Select Shipping" size='medium' showSearch className='form-select mb-2'
                                onChange={(value) => { setShipping(value) }} value={shipping ? "Yes" : "No"}>

                                <Option key={0} value={"1"}>Yes</Option>
                                <Option key={1} value={"0"}>No</Option>

                            </Select>

                            <div className="mb-3">
                                <button type='submit' onClick={handleUpdate} className='btn btn-primary mx-2'>Update Product</button>
                                <button type='submit' onClick={handleDelete} className='btn btn-danger mx-2'>Delete Product</button>
                                {/* <button type="submit" className="btn btn-primary">Add Product</button> */}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct