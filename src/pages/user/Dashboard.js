import React from 'react'
import Layout from '../../components/Layout/Layout'
import { useSelector } from 'react-redux';
import UserMenu from '../../components/Layout/UserMenu';

const Dashboard = () => {
    const { user } = useSelector(state => state.auth);
    return (
        <Layout title={"Dashboard - iShop"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3"> <UserMenu /> </div>
                    <div className="col-md-9">
                        <div className="card w-75 m-3 p-1">
                            <h4> User Name: {user?.name} </h4>
                            <h4> User Email: {user?.email} </h4>
                            <h4> User Address: {user?.address} </h4>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard