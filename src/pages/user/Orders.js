import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { token } = useSelector(state => state.auth)
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const getOrders = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/orders`, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // console.log("this is data", data);

            setOrders(data);

        } catch (error) {
            // console.log(error);;
            toast.error("Error while getting orders")
        }
    }

    useEffect(() => {
        getOrders();
    }, [])


    return (
        <Layout title={"Your Orders"}>
            <div className="container-fluid my-3 p-3">
                <div className="row">
                    <div className="col-md-3"> <UserMenu /> </div>
                    <div className="col-md-9">
                        <h4 className='text-center'>All Orders</h4>

                        <div className="border shadow">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Buyer</th>
                                        <th scope='col'>Ordered</th>
                                        <th scope='col'>Payment</th>
                                        <th scope='col'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders?.map((o, i) => {
                                            return (
                                                <tr onClick={() => { navigate(`/dashboard/user/order-details/${o._id}`) }}>
                                                    <td>{i + 1}</td>
                                                    <td>{o?.status}</td>
                                                    <td>{o?.buyer?.name}</td>
                                                    <td>{moment(o?.createdAt).fromNow()}</td>
                                                    <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                    <td>{o?.products?.length}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Orders