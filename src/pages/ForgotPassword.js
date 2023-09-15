import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {


    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [question, setQuestion] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgotPassword`, { email, newPassword, question })

            if (res?.data?.success) {
                toast.success(res?.data?.message, {
                    duration: 1000, position: 'top-center'
                });

                setTimeout(() => {
                    // this is used to redirect to any page we r accessing but we can't access it until we r logged in. so login first then redirect to it.
                    navigate('/login');
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
        <Layout title={"Forgot Password"}>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className='title'>RESET PASSWORD</h2>

                    <div className="mb-2">
                        <label htmlFor="inputEmail" className="form-label my-0">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="inputEmail" minLength={1} required />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="inputPassword" className="form-label my-0">New Password</label>
                        <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type="password" className="form-control" id="inputPassword" minLength={6} required />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="inputQuestion" className="form-label my-0">Security Question</label>
                        <input onChange={(e) => setQuestion(e.target.value)} value={question} type="text" className="form-control" id="inputQuestion" minLength={1} required />
                    </div>


                    <div className='d-flex mb-2 justify-content-center'>
                        <button type="submit">RESET</button>
                    </div>

                </form>
            </div>
        </Layout>
    )
}

export default ForgotPassword