import React from 'react'
import Layout from '../components/Layout/Layout'

const PageNotFound = () => {
    return (
        <Layout title="Go Back - page not found">
            <div className='fullPageCenter'>
                <div style={{ textAlign: 'center' }}>

                    <h1>404</h1>
                    <h2>Oops! Page Not Found</h2>
                    <button className='buttons'>Go Back</button>
                </div>
            </div>
        </Layout>
    )
}

export default PageNotFound