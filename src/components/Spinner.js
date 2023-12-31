import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Spinner = ({ path = "login" }) => {
    const [counter, setCounter] = useState(2);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevValue) => --prevValue);
        }, 1000);
        counter === 0 && navigate(`/${path}`)

        return () => clearInterval(interval);

    }, [counter, navigate, path])


    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h2 className='text-center'>Redirecting</h2>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner