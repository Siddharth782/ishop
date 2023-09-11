import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { BsShop } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { authActions } from '../../redux/authSlice'

const Header = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    console.log("role", user?.role)
    const handleLogout = () => {
        dispatch(authActions.logOut());
        localStorage.removeItem('auth');
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand" > <BsShop /> IShop</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link ">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/category" className="nav-link ">Category</NavLink>
                            </li>

                            {/* the below fragment is for checking if there is a user logged in or not */}

                            {
                                !user ? (
                                    <> <li className="nav-item">
                                        <NavLink to="/register" className="nav-link" >Register</NavLink>
                                    </li>
                                        <li className="nav-item">
                                            <NavLink to="/login" className="nav-link" >Login</NavLink>
                                        </li> </>
                                ) : (<>

                                    {/* <li><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li> */}

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
                                <NavLink to="/cart" className="nav-link" >Cart (0)</NavLink>
                            </li>
                        </ul>
                    </div>

                </div >
            </nav >
        </>
    )
}

export default Header