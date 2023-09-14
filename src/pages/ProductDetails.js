import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const params = useParams();

    // get product
    const getProduct = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setLoading(false);
            if (data?.success) {
                setProduct(data?.product);
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Something went wrong while getting products");
        }

    }

    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug])


    return (
        <Layout>
            <div className="row container my-3">
                <div className="col-md-6" style={{ backgroundColor: 'green' }}>

                    <div className="d-flex card m-3" key={product._id} style={{ width: '18rem' }}>
                        <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            className="card-img-top" alt={product.name} />
                    </div>

                </div>
                <div className="col-md-6">
                    <h1 className='text-center'>Product details</h1>
                    <h6>Name: {product?.name}</h6>
                    <h6>Description: {product?.description}</h6>
                    <h6>Price: {product?.price}</h6>
                    <button className="btn btn-secondary ms-1">Add to cart</button>
                </div>
            </div>

            <div className="row container" style={{ backgroundColor: 'green' }}>
                Similar products
            </div>
        </Layout>
    )
}

export default ProductDetails