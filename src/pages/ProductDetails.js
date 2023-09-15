import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetails = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [similarProducts, setSimilarProducts] = useState([]);
    const params = useParams();

    // get product
    const getProduct = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setLoading(false);
            if (data?.success) {
                setProduct(data?.product);
                getSimilarProducts(data?.product._id, data?.product.category._id);
            }

        } catch (error) {
            setLoading(false);
            // console.log(error);;
            toast.error("Something went wrong while getting products");
        }

    }

    // get product
    const getSimilarProducts = async (pid, cid) => {
        // console.log("product", pid, "category", cid);
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setLoading(false);
            if (data?.success) {
                setSimilarProducts(data?.products);
            }

        } catch (error) {
            setLoading(false);
            // console.log(error);;
            toast.error("Something went wrong while getting similar products");
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
                    <h6>Name {product?.name}</h6>
                    <p>Description: {product?.description}</p>
                    <p>Price: Rs.{product?.price}</p>
                    <button className="btn btn-secondary ms-1">Add to cart</button>
                </div>
            </div>
            <hr />
            <div className="row container" style={{ backgroundColor: 'green' }}>
                <h2>
                    {similarProducts.length >= 1 && "Similar products"}
                </h2>
                {similarProducts?.map((product) =>
                    <div className="d-flex card m-3" key={product._id} style={{ width: '18rem', backgroundColor: 'red' }}>
                        <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                            className="mt-3 card-img-top img-responsive" alt={product.name} style={{ height: "15rem" }} />
                        <div className="card-body">
                            <h6 className="card-title">{product?.name}</h6>
                            <p className="card-text">Rs. {product?.price}</p>
                            <p className="card-text">{product?.description.substring(0, 60)}</p>
                            <button onClick={() => { navigate(`/product/${product?.slug}`) }} className="btn btn-primary">More Details</button>
                            <button className="btn btn-secondary ms-1">Add to cart</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default ProductDetails