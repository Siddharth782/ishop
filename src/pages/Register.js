import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name, email, password, phone, address
            })
            // console.log("the response from backend", res);

            if (res?.data?.success) {
                toast.success(res?.data?.message, {
                    duration: 3000, position: 'top-center'
                });
                // did this bcoz the toast was not visble as it navigates to the other page 
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
            else {
                toast.error(res?.data?.message)
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong!!. Try again later.')
        }
    }

    return (
        <Layout title="Register iShop">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2 className='title'>REGISTER FORM</h2>

                    <div className="mb-2">
                        <label htmlFor="inputName" className="form-label">Name</label>
                        <input onChange={(e) => setName(e.target.value)} type="text" value={name} className="form-control" id="inputName" placeholder='First and Last Name' minLength={5} required />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="inputEmail" className="form-label">Email address</label>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-control" id="inputEmail" minLength={1} required />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="inputPassword" className="form-label">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control" id="inputPassword" minLength={6} placeholder='Atleast 6 characters' required />
                    </div>


                    <div className="mb-2">
                        <label htmlFor="inputPhone" className="form-label">Phone</label>
                        <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" className="form-control" id="inputPhone" minLength={1} required />
                    </div>


                    <div className="mb-2">
                        <label htmlFor="inputAddress" className="form-label">Address</label>
                        <input onChange={(e) => setAddress(e.target.value)} value={address} type="text" className="form-control" id="inputAddress" minLength={1} required />
                    </div>

                    <div className='d-flex justify-content-center'>
                        <button type="submit">Submit</button>
                    </div>

                </form>
            </div>
        </Layout>
    )
}

export default Register