import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { BsShop } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../../redux/authSlice'
import SearchInput from '../Form/SearchInput'
import useCategory from '../../hooks/useCategory'
import { Badge } from 'antd'

const Header = () => {
    const { user } = useSelector(state => state.auth);
    const { cart } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const categories = useCategory();

    const handleLogout = () => {
        dispatch(authActions.logOut());
        localStorage.removeItem('auth');
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top" style={{ padding: 0 }}>


                <div className="container-fluid" style={{ backgroundColor: "lightBlue", padding: 5, display: 'flex', justifyContent: 'space-around' }}>

                    <Link to="/" className="navbar-brand"> <BsShop /> IShop</Link>

                    <div style={{ backgroundColor: "lightBlue", padding: 5 }}>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>


                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                            <SearchInput />
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                                {/* the below fragment is for checking if there is a user logged in or not */}

                                {
                                    !user ? (

                                        <>
                                            <li className="nav-item dropdown">
                                                <Link className="nav-link dropdown-toggle" to={"/login"} id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Accounts
                                                </Link>
                                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                    <Link to={`/login`} className="dropdown-item">
                                                        Login
                                                    </Link>
                                                    <li>
                                                        <Link to={`/register`} className="dropdown-item">
                                                            Sign Up
                                                        </Link>
                                                    </li>

                                                </ul>
                                            </li>
                                        </>
                                    ) : (<>

                                        <li className="nav-item dropdown">
                                            <NavLink className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Accounts & Options
                                            </NavLink>

                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><NavLink className="dropdown-item" to={`/dashboard${user?.role === 1 ? "/admin" : ""}`}>Dashboard</NavLink></li>
                                                <li><NavLink onClick={handleLogout} to="/login" className="dropdown-item" >Logout</NavLink></li>
                                            </ul>
                                        </li>
                                    </>)}

                                <li className="nav-item">
                                    <Badge count={cart?.length}>
                                        <NavLink to="/cart" className="nav-link" >Cart</NavLink>
                                    </Badge>
                                </li>

                                {/* <li className="nav-item">
                                    <NavLink to="/cart" className="nav-link" >Become a seller</NavLink>
                                </li> */}

                            </ul>
                        </div>
                    </div>

                </div >
            </nav >
        </>
    )
}

export default Header