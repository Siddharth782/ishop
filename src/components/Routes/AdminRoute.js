import axios from 'axios';
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Spinner from '../Spinner';

export default function AdminRoute() {

    const [ok, setOk] = useState(false);
    const token = JSON.parse(localStorage?.getItem('auth'))?.token
    console.log("inside admin private", token);

    const authCheck = async () => {
        console.log("inside admin checking");
        let res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/admin-auth`, {
            headers: {
                "Authorization": token
            }
        })

        if (res?.data?.ok) {
            setOk(true);
        } else setOk(false);
        console.log("checking done for admin");

    }
    useEffect(() => {
        authCheck();
    }, [token])

    // outlet is used for nested routing

    return ok ? <Outlet /> : <Spinner path="" />;
}