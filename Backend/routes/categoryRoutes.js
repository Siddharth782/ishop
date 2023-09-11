import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleWare.js';
import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

const router = express.Router();

// creating a new category
router.post('/create-category', requireSignIn, isAdmin, async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(401).send({
                message: "Name of category is required",
            })
        }

        const existingCategory = await categoryModel.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category with this name exists.",
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(20).send({
            success: true,
            message: 'New category created',
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in category"
        })
    }
});


// updating category
router.put('/update-category/:id', requireSignIn, isAdmin, async (req, res) => {
    try {

        const { name } = req.body;
        const { id } = req.params;

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            message: "Category updated successfully.",
            category
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
    }
})

// get all categories
router.get('/get-category', async (req, res) => {
    try {


        const category = await categoryModel.find({});

        res.status(200).send({
            success: true,
            message: "List of all categories",
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all category"
        })
    }
})

// get one category
router.get('/single-category/:slug', async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req?.params?.slug });

        res.status(200).send({
            success: true,
            message: "Got single category",
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single category"
        })
    }
})

// delete one category
router.get('/delete-category/:id', isAdmin, requireSignIn, async (req, res) => {
    try {

        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Deleted category successfully"
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
    }
})

export default router