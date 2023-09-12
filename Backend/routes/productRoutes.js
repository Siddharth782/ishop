import express from 'express'
import slugify from 'slugify';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleWare.js';
import productModel from '../models/productModel.js';
import formidable from 'express-formidable';

const router = express.Router();

// creating a new product
router.post('/create-product', requireSignIn, isAdmin, formidable(), async (req, res) => {

    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({
                    message: "Name of product is required",
                })
                break;
            case !description:
                return res.status(500).send({
                    message: "Description is required",
                })
                break;
            case !price:
                return res.status(500).send({
                    message: "price of product is required",
                })
                break;
            case !category:
                return res.status(500).send({
                    message: "Category of product is required",
                })
                break;
            case !quantity:
                return res.status(500).send({
                    message: "Quantity of product is required",
                })
                break;
            case photo && photo.size > 1000:
                return res.status(500).send({
                    message: "Photo is required",
                })
                break;
        }

        const products = new productModel.findOne({ ...req.fields, slug: slugify(name) });

        if (photo) {
            products?.photo?.data = fs.readFileSync(photo?.path);
            products?.photo?.contentType = photo.type;
        }

        await products.save();

        res.status(201).send({
            success: true,
            message: 'New product created',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating products"
        })
    }
});


// updating product
router.put('/update-product/:pid', requireSignIn, isAdmin, async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        const { pid } = req.params;

        switch (true) {
            case !name:
                return res.status(500).send({
                    message: "Name of product is required",
                })
                break;
            case !description:
                return res.status(500).send({
                    message: "Description is required",
                })
                break;
            case !price:
                return res.status(500).send({
                    message: "price of product is required",
                })
                break;
            case !category:
                return res.status(500).send({
                    message: "Category of product is required",
                })
                break;
            case !quantity:
                return res.status(500).send({
                    message: "Quantity of product is required",
                })
                break;
            case photo && photo.size > 1000:
                return res.status(500).send({
                    message: "Photo is required",
                })
                break;
        }

        const products = await productModel.findByIdAndUpdate(pid, { ...req?.fields, slug: slugify(name) }, { new: true });

        if (photo) {
            products?.photo?.data = fs.readFileSync(photo?.path);
            products?.photo?.contentType = photo.type;
        }

        await products.save();

        res.status(200).send({
            success: true,
            message: "Product updated successfully.",
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating product"
        })
    }
})

// get all products
router.get('/get-product', async (req, res) => {
    try {


        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 });
        // select("-photo") gives back everything except photo
        // limit according to time created

        res.status(200).send({
            success: true,
            message: "List of all products",
            products,
            total: products.length
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all products"
        })
    }
})

// get one product
router.get('/get-product/:slug', async (req, res) => {
    try {

        const product = await productModel.findOne({ slug: req?.params?.slug }).populate('category').select("-photo");

        res.status(200).send({
            success: true,
            message: "Got single product",
            product
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single product"
        })
    }
})


// get photo
router.get('/product-photo/:pid', async (req, res) => {
    try {

        const product = await productModel.findById(req?.params?.pid).select("photo");

        if (product?.photo?.data) {
            res.set('Content-type', product?.photo?.contentType);

            return res.status(200).send(product?.photo?.data);
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting product photo"
        })
    }
})


// delete one product
router.get('/product/:pid', isAdmin, requireSignIn, async (req, res) => {
    try {

        const { pid } = req?.params;
        await productModel.findByIdAndDelete(pid).select("-photo");

        res.status(200).send({
            success: true,
            message: "Deleted product successfully"
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting product"
        })
    }
})

export default router