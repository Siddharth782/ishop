import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchActions } from '../../redux/searchSlice'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const { keyword } = useSelector(state => state.search);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${keyword}`)
            dispatch(searchActions.inputSearch({ results: data }));
            navigate("/search");

        } catch (error) {
            // console.log(error);
        }

    }

    return (
        <>
            <form className="d-flex" onSubmit={handleSubmit}>
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={(e) => {
                    setSearchValue(e.target.value);
                    dispatch(searchActions.inputSearch({ keyword: e.target.value }))
                }} />
                <button className="btn btn-outline-primary" type="submit" style={{ color: "darkblue" }}>Search</button>
            </form>

        </>
    )
}

export default SearchInput