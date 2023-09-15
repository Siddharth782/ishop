import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';


const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector(state => state.auth);
  const { cart } = useSelector(state => state.cart);

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  // total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => { total += item?.price });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error while removing item from cart");
    }
  }

  // removing items from cart
  const handleRemove = (id) => {
    try {
      let myCart = [];

      for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === id) continue;
        myCart.push(cart[i]);
      }

      dispatch(cartActions.removeFromCart({ cart: myCart }));
      toast.success("Item removed from cart");
    } catch (error) {
      console.log(error);
      toast.error("Error while removing item from cart");
    }
  }

  // get payment gateway token
  const getToken = async () => {
    try {

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);

      if (data?.success) {
        setClientToken(data?.clientToken);
      }
      else {
        toast.error("Didn't get a client token from payment gateway");
      }

    } catch (error) {
      console.log(error);
      toast.error("Error while getting token");
    }
  }

  const handlePayment = async () => {
    setLoading(true);
    try {

      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, { nonce, cart }, {
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setLoading(false);

      if (data?.ok) {
        localStorage.removeItem("cart");
        dispatch(cartActions.emptyCart());
        navigate('/dashboard/user/orders');
        toast.success("Payment Successful");
      }

    } catch (error) {

      setLoading(false);
      console.log(error);
      toast.error("Payment Failed")

    }
  }

  useEffect(() => {
    getToken();
  }, [token])


  return (
    <Layout>
      <div className="container">

        <div className="row">
          <h2>Your Cart</h2>
          {/* {!token && "Login to check out"} */}
        </div>

        <div className="row">

          <div className="col-md-7">
            <div className="d-flex flex-wrap">
              {cart?.map((product) =>

                <div className="row flex-row" key={product._id}>

                  <div className="col-md-4">
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} alt={product.name} />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <p className="card-title">{product?.name}</p>
                      <p className="card-text">Rs. {product?.price}</p>
                      <p className="card-text">{product?.description.substring(0, 60)}</p>
                      <button onClick={() => handleRemove(product._id)} className='btn btn-danger'>Remove from Cart</button>
                    </div>
                  </div>

                </div>

              )}
            </div>
          </div>

          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <hr />
            <h4>Total: {totalPrice()} </h4>
            {user?.address?.length > 0 ?
              (
                <>
                  <div className="mb-3">
                    <h5>Current Address</h5>
                    <h6>{user?.address}</h6>
                    <button onClick={() => navigate('/dashboard/user/profile')} className='btn btn-outline-warning'>Update Address</button>
                  </div>
                </>
              ) : (
                <>
                  {
                    token ? (
                      <button onClick={() => navigate('/dashboard/user/profile')} className='btn btn-outline-primary'>
                        Add an Address
                      </button>
                    ) : (
                      <button onClick={() => navigate('/login', { state: "/cart" })} className='btn btn-outline-primary'>
                        Login to checkout
                      </button>
                    )
                  }
                </>
              )
            }

            <div className="my-1">

              {(clientToken && cart.length) && <DropIn
                options={{ authorization: clientToken }}
                onInstance={(instance) => (setInstance(instance))}
              />}

              <button className='btn btn-primary' onClick={handlePayment}>
                {loading ? "Processing Payment" : "Make Payment"}
              </button>

            </div>

          </div>
        </div>


      </div>
    </Layout >
  )
}

export default CartPage