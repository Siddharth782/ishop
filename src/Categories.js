import React from 'react'
import Layout from './components/Layout/Layout'
import useCategory from './hooks/useCategory'
import { Link } from 'react-router-dom'


const Categories = () => {
    const categories = useCategory();

    return (
        <Layout title={"All Categories"}>
            <div className="container">
                <h1>All categories</h1>
                <div className="row">

                    {categories?.map((cat) =>
                        <div className="col-md-6 my-3" key={cat._id}>
                            <Link to={`/category/${cat.slug}`} className="btn btn-primary">
                                {cat.name}
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    )
}

export default Categories