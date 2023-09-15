import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices.js'
import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../redux/cartSlice';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector(state => state.cart);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // console.log("cart is", cart)

    // get total count 
    const getTotal = async () => {
        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            if (data?.success) {
                setTotal(data?.total);
            }

        } catch (error) {
            // console.log(error);;
            toast.error("Something went wrong while getting products");
        }

    }

    // get all products
    const getAllProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
            setLoading(false);
            if (data?.success) {
                setProducts(data?.products);
            }

        } catch (error) {
            setLoading(false);
            // console.log(error);;
            toast.error("Something went wrong while getting products");
        }

    }

    // getting all categories
    const getAllcategory = async () => {

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }

        } catch (error) {
            // console.log(error);;
        }

    }


    // handling filter by categories
    const handleFilter = async (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            // this for removing if already checked
            all = all.filter(c => c != id)
        }

        setChecked(all);

        try {

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }

        } catch (error) {
            // console.log(error);;
        }

    }

    const handleAddToCart = (product) => {
        try {
            dispatch(cartActions.addToCart({ product: product }));
            // localStorage.setItem('cart', JSON.stringify([...cart, product]));
            toast.success("Item added to cart");
        } catch (error) {
            // console.log(error);;
            toast.error("Error while adding item to cart");
        }
    }

    // getting filtered products
    const filteredProducts = async () => {
        try {

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, { checked, radio });

            if (data?.success) {
                setProducts(data?.products);
            }

        } catch (error) {
            // console.log(error);;
        }
    }

    // load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);

            setLoading(false);
            if (data?.success) {
                setProducts([...products, ...data?.products]);
            }

        } catch (error) {
            setLoading(false);
            // console.log(error);;
        }
    }

    useEffect(() => {

        getTotal();
        getAllcategory();
        if (!checked.length && !radio.length) {
            getAllProducts();
        }

    }, [])

    useEffect(() => {

        if (checked.length || radio.length) filteredProducts();

    }, [checked, radio])

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page])

    return (
        <Layout title={"All-Products - Best Offers"}>
            <h2>HomePage</h2>
            <div className="row">

                <div className="col-md-3 mt-3">
                    <h4 className="text-center">Filter By Category</h4>

                    <div className="d-flex flex-column ms-2">
                        {categories?.map((cat) =>

                            <Checkbox key={cat._id} onChange={(e) => { handleFilter(e.target.checked, cat._id) }} >
                                {cat?.name}
                            </Checkbox>

                        )}
                    </div>

                    <h4 className="text-center mt-3">Filter By Prices</h4>

                    <div className="d-flex flex-column ms-2">
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>
                                        {p.name}
                                    </Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <div style={{ justifyContent: 'center' }} className="mt-2 d-flex">
                        <button className='btn btn-danger'
                            onClick={() => window.location.reload}>Reset Filters</button>
                    </div>

                </div>

                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>
                    {/* displaying all products */}
                    <div className="d-flex flex-wrap">
                        {products?.map((product) =>
                            <div className="d-flex card m-3" key={product._id} style={{ width: '18rem' }}>
                                <img
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                    className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h6 className="card-title">{product?.name}</h6>
                                    <p className="card-text">Rs. {product?.price}</p>
                                    <p className="card-text">{product?.description.substring(0, 60)}</p>

                                    <button onClick={() => { navigate(`/product/${product?.slug}`) }} className="btn btn-primary ms-1">More Details</button>


                                    <button onClick={() => handleAddToCart(product)} className="btn btn-secondary ms-1">Add to cart</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='m-2 p-3'>
                        {products && products?.length < total && (
                            <button className='btn btn-warning' onClick={(e) => { e.preventDefault(); setPage(page + 1) }}>
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </div>

                </div>

            </div>
        </Layout>
    )
}

export default HomePage