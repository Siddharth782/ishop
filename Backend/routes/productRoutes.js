import express from 'express'
import slugify from 'slugify';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleWare.js';
import productModel from '../models/productModel.js';
import formidable from 'express-formidable';
import fs from 'fs';
import categoryModel from '../models/categoryModel.js';
import braintree from 'braintree';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';


const router = express.Router();
dotenv.config();

// for payment
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

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
            case photo && photo.size > 10000000:
                return res.status(500).send({
                    message: "Photo is required",
                })
                break;
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) });

        if (photo) {
            products.photo.data = fs.readFileSync(photo?.path);
            products.photo.contentType = photo.type;
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
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), async (req, res) => {
    console.log("inside function")
    try {
        console.log("inside function & trying")

        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        const { pid } = req.params;

        console.log("after destruct")
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
            case photo && photo.size > 1000000:
                return res.status(500).send({
                    message: "Photo is required",
                })
                break;
        }

        console.log("after checking values")
        const products = await productModel.findByIdAndUpdate(pid, { ...req?.fields, slug: slugify(name) }, { new: true });

        console.log("after finding product")

        if (photo) {
            products.photo.data = fs.readFileSync(photo?.path);
            products.photo.contentType = photo.type;
        }

        console.log("after checking photo")
        await products.save();

        return res.status(200).send({
            success: true,
            message: "Product updated successfully.",
            products
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: "Error while Updating product"
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
router.delete('/delete-product/:pid', requireSignIn, isAdmin, async (req, res) => {
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


// filter product
router.post('/product-filters', async (req, res) => {
    try {

        const { checked, radio } = req?.body;
        let args = {};
        if (checked.length > 0) args.category = checked

        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }

        const products = await productModel.find(args);

        res.status(200).send({
            success: true,
            products
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error while filtering product"
        })
    }
})

// product count
router.get('/product-count', async (req, res) => {
    try {

        const total = await productModel.find({}).estimatedDocumentCount();

        res.status(200).send({
            success: true,
            total
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in product count"
        })
    }
})

// products per page
router.get('/product-list/:page', async (req, res) => {
    try {

        const perPage = 6;
        const page = req.params?.page ? req.params?.page : 1;

        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in per page ctrl"
        })
    }
})


// products by search
router.get('/search/:keyword', async (req, res) => {
    try {

        const { keyword } = req?.params;


        // if the keyword matches any word in name or description we would show it. so we used $or
        // $options is for making the search case insensitive
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo");

        res.json(results);
        // res.status(200).send({
        //     success: true,
        //     products
        // })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in search products"
        })
    }
})


// similar products
router.get('/related-product/:pid/:cid', async (req, res) => {
    try {

        const { pid, cid } = req?.params;

        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(8).populate("category");

        res.status(200).send({
            success: true,
            products
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in getting related products"
        })
    }
})


// category wise products
router.get('/product-category/:slug', async (req, res) => {
    try {

        const { slug } = req?.params;

        const category = await categoryModel.findOne({ slug: slug });

        const products = await productModel.find({ category }).populate("category");

        res.status(200).send({
            success: true,
            category,
            products
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in category wise products"
        })
    }
})


// for payment token from braintree
router.get('/braintree/token', async (req, res) => {
    try {

        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(response);
            }
        })


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in getting token"
        })
    }
})

// for payments
router.post('/braintree/payment', requireSignIn, async (req, res) => {
    try {

        const { cart, nonce } = req?.body;
        let totalPrice = 0;

        cart?.map((p) => { totalPrice += p.price });

        let newTransaction = gateway.transaction.sale({
            amount: totalPrice,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save();

                    res.json({ ok: true });
                } else {
                    res.status(500).send(error)
                }
            }
        )


    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error in payments"
        })
    }
})


export default router