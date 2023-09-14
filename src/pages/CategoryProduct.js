import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params?.slug}`);

            if (data?.success) {
                setProducts(data?.products);
                setCategory(data?.category);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while getting category products");
        }
    }

    useEffect(() => {
        if (params?.slug) getProductByCat();
    }, [params?.slug])


    return (
        <Layout>
            <div className="container">
                <h2 className='text-center mt-3'>{category?.name}</h2>

                <div className="row">
                    <div className="d-flex flex-wrap">
                        {products?.map((product) =>
                            <div className="d-flex card m-3" key={product._id} style={{ width: '18rem' }}>
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
                </div>

            </div>
        </Layout>
    )
}

export default CategoryProduct