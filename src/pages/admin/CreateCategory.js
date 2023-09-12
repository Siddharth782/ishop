import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout.js'
import AdminMenu from '../../components/Layout/AdminMenu.js'
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm.js';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

const CreateCategory = () => {
    const { token } = useSelector(state => state.auth);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);

    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");


    // handle update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected?._id}`, { name: updatedName }, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (data?.success) {
                toast.success(data?.message);
                getAllcategory();
                setSelected(null);
                setVisible(false);
                setUpdatedName("");
            } else {
                toast.error(data?.message);
            }


        } catch (error) {
            console.log(error);
            toast.error('Error in updating category');
        }
    }

    // handle delete
    const handleDelete = async (id) => {

        console.log("the id is ", id);
        try {

            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${id}`, {
                headers: {
                    'Authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (data?.success) {
                toast.success(data?.message);
                getAllcategory();
            } else {
                toast.error(data?.message);
            }


        } catch (error) {
            console.log(error);
            toast.error('Error in deleting category');
        }
    }

    // handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // console.log("inside after clicking");

            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, { name }, {
                headers: {
                    'authorization': token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // console.log("the data is ", data);

            if (data?.success) {
                toast.success(data?.message);
                getAllcategory();
            } else {
                toast.error(data?.message);
            }


        } catch (error) {
            console.log(error);
            toast.error('Error in input form');
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
            console.log(error);
            toast.error("Something went wrong while getting category");
        }

    }

    useEffect(() => {
        getAllcategory();
    }, [])

    return (
        <Layout title={"Dashboard- Create Category"}>
            <div className="container-fluid p-3">

                <div className="row">
                    <div className="col-md-3"> <AdminMenu /> </div>
                    <div className="col-md-9">
                        <h1> Manage Categories </h1>

                        <div className="p-3 w-50">
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />

                        </div>

                        {/* displaying all the categories */}

                        <div className='w-75'>

                            <table className="table">

                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categories?.map((cat) => (
                                        <>
                                            <tr>
                                                <td key={cat?._id} >{cat?.name}</td>
                                                <td>
                                                    <button onClick={() => { setVisible(true); setUpdatedName(cat.name); setSelected(cat) }} className='btn btn-primary ms-2'>Edit</button>
                                                    <button onClick={() => { handleDelete(cat._id) }} className='btn ms-2 btn-danger'>Delete</button>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                        <Modal open={visible} onCancel={() => setVisible(false)} footer={null} >
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateCategory