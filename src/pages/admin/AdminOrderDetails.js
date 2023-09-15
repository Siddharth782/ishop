import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import moment from 'moment';
import { Select } from 'antd';
const { Option } = Select;

const AdminOrderDetails = () => {
    const params = useParams();
    const { token } = useSelector(state => state.auth);
    const [order, setOrder] = useState([]);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState([
        "Not Process",
        "Processing",
        "Shipped",
        "Delievered",
        "Cancel",
    ]);

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

    const handleChange = async (id, value) => {
        try {

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-update/${id}`, { status: value }, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (data) {
                getOrderDetails();
                toast.success("Status updated successfully");
            }

        } catch (error) {
            console.log(error);
            toast.error("Error in updating status");
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, [])

    return (
        <Layout title={"Order Details"}>
            <div className="container-fluid my-3 p-3">
                <div className="row">
                    <div className="col-md-3"> <AdminMenu /> </div>
                    <div className="col-md-9">
                        <h4>Orders Details</h4>

                        <div className="border shadow">
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Buyer</th>
                                        <th scope='col'>Ordered</th>
                                        <th scope='col'>Payment</th>
                                        <th scope='col'>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Select
                                                bordered={false}
                                                onChange={(value) => handleChange(order._id, value)}
                                                value={order?.status}
                                            >
                                                {status.map((s, i) => (
                                                    <Option key={i} value={s}>
                                                        {s}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </td>
                                        <td>{order?.buyer?.name}</td>
                                        <td>{moment(order?.createdAt).fromNow()}</td>
                                        <td>{order?.payment?.success ? "Success" : "Failed"}</td>
                                        <td>{products?.length}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        {products?.map((product) => {
                            return (
                                <div className='row my-3'>
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
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrderDetails