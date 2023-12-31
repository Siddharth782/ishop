import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminOrders = () => {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth)
    const [orders, setOrders] = useState([])

    const getAllOrdersReceived = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            setOrders(data);

        } catch (error) {
            // console.log(error);;
            toast.error("Error while getting orders")
        }
    }


    useEffect(() => {
        getAllOrdersReceived();
    }, [])

    return (
        <Layout title="All Received Orders">
            <div className="container-fluid p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className='text-center'>All Orders</h1>
                        <div className="border shadow">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Buyer</th>
                                        <th scope='col'>Orders</th>
                                        <th scope='col'>Payment</th>
                                        <th scope='col'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders?.map((o, i) => {
                                            return (
                                                <tr onClick={() => { navigate(`/dashboard/admin/order-update/${o._id}`) }}>
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

export default AdminOrders