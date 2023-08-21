import React from 'react'
import Layout from '../components/Layout/Layout'
import { useSelector } from 'react-redux'

const HomePage = () => {
    const { user } = useSelector(state => state.auth);
    // console.log("user details", user);

    return (
        <Layout>
            <h2>HomePage</h2>
            <h3>The name of loggedIn user is {user?.name}</h3>
        </Layout>
    )
}

export default HomePage