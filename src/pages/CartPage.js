import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { cart } = useSelector(state => state.cart);

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
          </div>
        </div>


      </div>
    </Layout >
  )
}

export default CartPage