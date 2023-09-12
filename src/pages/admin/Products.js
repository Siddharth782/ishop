import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Products = () => {

    const [products, setProducts] = useState([]);

    // get all products
    const getAllProducts = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            if (data?.success) {
                setProducts(data?.products);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while getting products");
        }

    }

    useEffect(() => {
        getAllProducts();
    }, [])


    return (
        <Layout>
            <div className="container-fluid p-3">

                <div className="row">
                    <div className="col-md-3"> <AdminMenu /> </div>
                    <div className="col-md-9">
                        <h1 className='text-center'> All Products </h1>

                        <div style={{ flex: 1, flexDirection: 'column' }} className="d-flex mb-3 w-75">
                            {products?.map((product) =>

                                <Link className='product-link' key={product._id} to={`/dashboard/admin/product/${product?.slug}`}>

                                    <div className="d-flex card m-3" key={product._id} style={{ width: '18rem' }}>
                                        <img
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                            className="card-img-top" alt={product.name} />
                                        <div className="card-body">
                                            <h6 className="card-title">{product?.name}</h6>
                                            <p className="card-text">{product?.description}</p>
                                        </div>
                                    </div>
                                </Link>

                            )}
                        </div>

                    </div>
                </div>

            </div>

        </Layout>
    )
}

export default Products