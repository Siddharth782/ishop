import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();

    const { token } = useSelector(state => state.auth);

    const [categories, setCategories] = useState([]);

    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");


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

    // handling new product
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // console.log("this is inside create product");

            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("photo", photo);
            productData.append("category", category);
            productData.append("shipping", shipping);

            // console.log("this is product data", productData);

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, productData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            })

            // console.log("this is after axios posting", data);

            if (data?.success) {
                toast.success(data?.message);
                navigate('/dashboard/admin/products');
            } else {
                toast.error(data?.message);
            }

        } catch (error) {
            // console.log(error);;
            toast.error("Error while adding new product");
        }
    }

    useEffect(() => {
        getAllcategory();
    }, [])

    return (
        <Layout title={"Dashboard- Create Product"}>
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3"> <AdminMenu /> </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>

                        {/* getting all info about the product being added */}
                        <div className="p-1 w-75">


                            {/* this is for selecting the category of new product we r adding */}
                            <Select bordered={false} placeholder="Select a category" size='medium' showSearch className='form-select mb-2'
                                // this value is coming from ant design
                                onChange={(value) => { setCategory(value) }}>
                                {categories.map((cat) => (
                                    <Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>

                            {/* this is for selecting the image we r gonna upload for showing */}
                            <div className="mb-2">
                                <label className='btn btn-outline-primary' >
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />
                                    {/* image/* is used to tell any type of image would work - png, jpg */}
                                    {/* .files would be an array and we would have to select only first of them */}
                                </label>
                            </div>

                            {/* this is the preview of uploaded image only when the photo is not null */}
                            <div className="mb-3">
                                {photo && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(photo)} alt="Product Photo" height={'200px'} className='img img-responsive' />
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
                                onChange={(value) => { setShipping(value) }}>

                                <Option key={0} value={"1"}>Yes</Option>
                                <Option key={1} value={"0"}>No</Option>

                            </Select>

                            <div className="mb-3">
                                <button type='submit' onClick={handleCreate} className='btn btn-primary'>Add Product</button>
                                {/* <button type="submit" className="btn btn-primary">Add Product</button> */}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct