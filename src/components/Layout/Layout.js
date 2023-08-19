import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Helmet } from 'react-helmet'

const Layout = (props) => {
    return (
        <div>
            <Header />
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={props.description} />
                <meta name="keywords" content={props.keywords} />
                <meta name="author" content={props.author} />
                <title>{props.title}</title>
            </Helmet>
            <main style={{ height: "78vh" }}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

Layout.defaultProps = {
    title: 'iShop- Best Place to buy home appliances at best possible price.',
    description: 'MERN stack project',
    keywords: 'react',
    author: 'Siddharth'
}

export default Layout