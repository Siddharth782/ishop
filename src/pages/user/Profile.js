import React, { useEffect, useState } from 'react'
import UserMenu from '../../components/Layout/UserMenu'
import Layout from '../../components/Layout/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authActions } from '../../redux/authSlice';

const Profile = () => {
    const { user, token } = useSelector(state => state.auth);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [address, setAddress] = useState(user?.address);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, { name, email, phone, address }, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            if (data?.success) {

                dispatch(authActions.logIn({ user: data?.updatedUser }));

                let updatedData = { user: data?.updatedUser, token };

                localStorage.setItem('auth', JSON.stringify(updatedData));

                toast.success(data?.message);
            }
            else {
                toast.error(data?.message)
            }

        } catch (error) {
            // console.log(error);;
            toast.error('Something went wrong!!. Try again later.')
        }
    }

    return (
        <Layout title={"Your Profile"}>
            <div className="container-fluid px-3">
                <div className="row">
                    <div className="col-md-3 py-3"> <UserMenu /> </div>
                    <div className="col-md-9">

                        <div className="form-container">
                            <h4>Your Profile</h4>
                            <form onSubmit={handleSubmit}>


                                <div className="mb-1">
                                    <label htmlFor="inputName" className="form-label">Name</label>
                                    <input onChange={(e) => setName(e.target.value)} type="text" value={name} className="form-control" id="inputName" placeholder='Enter your Name' minLength={5} required />
                                </div>

                                <div className="mb-1">
                                    <label htmlFor="inputEmail" className="form-label">Email address</label>
                                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="inputEmail" minLength={1} required />
                                </div>

                                <div className="mb-1">
                                    <label htmlFor="inputPhone" className="form-label">Phone</label>
                                    <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className="form-control" id="inputPhone" minLength={1} required />
                                </div>


                                <div className="mb-1">
                                    <label htmlFor="inputAddress" className="form-label">Address</label>
                                    <input onChange={(e) => setAddress(e.target.value)} value={address} type="text" className="form-control" id="inputAddress" minLength={1} required />
                                </div>

                                <div className='d-flex justify-content-center'>
                                    <button type="submit">Update Profile</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile