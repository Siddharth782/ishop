import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Search = () => {
    const navigate = useNavigate();
    const { results } = useSelector(state => state.search);

    return (
        <Layout>
            <div className="container">
                <div className="text-center">
                    <h2>Search results</h2>
                    <h6>{results?.length >= 1 ? `Found ${results?.length}` : "No Products found"}</h6>

                    <div className="d-flex flex-wrap mt-4">
                        {results?.map((product) =>
                            <div className="d-flex card m-3" key={product._id} style={{ width: '18rem' }}>
                                <img
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                    className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h6 className="card-title">{product?.name}</h6>
                                    <p className="card-text">Rs. {product?.price}</p>
                                    <p className="card-text">{product?.description.substring(0, 60)}</p>
                                    {/* <button className="btn btn-secondary ms-1">Add to cart</button> */}
                                </div>
                                <button onClick={() => { navigate(`/product/${product?.slug}`) }} className="d-flex btn btn-primary ms-1 mb-6">Shop Now</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </Layout>
    )
}

export default Search