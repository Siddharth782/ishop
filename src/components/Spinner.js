import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Spinner = () => {
    const [counter, setCounter] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevValue) => --prevValue);
        }, 1000);
        counter === 0 && navigate('/login')

        return () => clearInterval(interval);

    }, [counter, navigate])


    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h2 className='text-center'>Redirecting to Login Page...</h2>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner