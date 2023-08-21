import axios from 'axios';
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Spinner from '../Spinner';

export default function PrivateRoute() {

    const [ok, setOk] = useState(false);
    const token = JSON.parse(localStorage?.getItem('auth'))?.token
    console.log("inside private", token);

    async function authCheck() {
        console.log("inside checking");
        let res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`, {
            headers: {
                "Authorization": token
            }
        })

        if (res?.data?.ok) {
            setOk(true);
        } else setOk(false);
        console.log("checking done");

    }
    useEffect(() => {
        authCheck();
    }, [token])

    // outlet is used for nested routing

    return ok ? <Outlet /> : <Spinner />;
}