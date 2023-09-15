import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../../redux/cartSlice';

const OrderDetails = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
    const [order, setOrder] = useState([]);
    const [products, setProducts] = useState([]);

    // buy again
    const handleAddToCart = (product) => {
        try {
            dispatch(cartActions.addToCart({ product: product }));
            // localStorage.setItem('cart', JSON.stringify([...cart, product]));
            toast.success("Item added to cart");
        } catch (error) {
            console.log(error);
            toast.error("Error while adding item to cart");
        }
    }

    // order details
    const getOrderDetails = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/order-details/${params.id}`, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log("this is data", data);

            setOrder(data);
            setProducts(data?.products);

        } catch (error) {
            console.log(error);
            toast.error("Error while getting orders")
        }
    }

    console.log("this is products", products);

    useEffect(() => {
        getOrderDetails();
    }, [])

    return (
        <Layout title={"Order Details"}>
            <div className="container-fluid my-3 p-3">
                <div className="row">
                    <div className="col-md-3"> <UserMenu /> </div>
                    <div className="col-md-9">
                        <h4>Orders Details</h4>
                        {products?.map((product) => {
                            return (
                                <div className='row my-3' style={{ backgroundColor: "lightgray", alignContent: "center" }}>
                                    <div className="col-md-2" style={{ width: "18rem" }} key={product._id}>
                                        <img
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                            className="card-img-top" alt={product.name} />
                                    </div>

                                    <div className="col-md-4">
                                        <h6>{product?.name}</h6>
                                        <p>Description: {product?.description}</p>
                                        <p>Price: Rs.{product?.price}</p>
                                    </div>

                                    <div className="col-md-2">
                                        <button onClick={() => handleAddToCart(product)} className="btn btn-secondary ms-1">Buy Again</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default OrderDetails