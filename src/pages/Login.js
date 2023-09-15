import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../redux/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, { email, password })

            if (res?.data?.success) {
                toast.success(res?.data?.message, {
                    duration: 1000, position: 'top-center'
                });
                dispatch(authActions.logIn({ user: res?.data?.user, token: res?.data?.token }));
                localStorage.setItem('auth', JSON.stringify(res?.data));
                setTimeout(() => {
                    // this is used to redirect to any page we r accessing but we can't access it until we r logged in. so login first then redirect to it.
                    navigate('/');
                }, 1000);
            }
            else {
                toast.error(res?.data?.message)
            }

        } catch (error) {
            // console.log(error);;
            toast.error('Something went wrong!!. Try again later.')
        }
    }

    return (
        <Layout title="Login - iShop">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className='title'>LOGIN FORM</h2>

                    <div className="mb-2">
                        <label htmlFor="inputEmail" className="form-label my-0">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="inputEmail" minLength={1} required />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="inputPassword" className="form-label my-0">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="inputPassword" minLength={6} required />
                    </div>


                    <div className='d-flex mb-2 justify-content-center'>
                        <button type="submit">Login</button>
                    </div>

                    <div className='d-flex mb-2 justify-content-center' onClick={() => navigate('/forgotPassword')}>
                        <button type="submit">Forgot Password</button>
                    </div>

                </form>
            </div>
        </Layout>
    )
}

export default Login