import express from 'express';
const router = express.Router();
import userModel from '../models/userModel.js';
import { body, validationResult } from 'express-validator'
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleWare.js';

// creating routes for auth(Registering User)
router.post('/register', [
    body('name', 'Enter a name of minimum 5 length').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a password of minimum 6 length').isLength({ min: 6 }),
    body('address', "Address field can't be empty").isLength({ min: 1 }),
    body('phone', "Phone field can't be empty").isLength({ min: 1 }),
], async (req, res) => {

    // checking for length errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array() });
    }

    try {
        // we get all these from form submitted by user while registering
        const { name, email, password, address, phone, question } = req.body;

        // validation checks
        if (!name) {
            return res.json({ message: 'Name is required!' })
        }
        if (!email) {
            return res.json({ message: 'Email is required!' })
        }
        if (!password) {
            return res.json({ message: "Password can't be empty!" })
        }
        if (!phone) {
            return res.json({ message: 'Phone is required!' })
        }
        if (!address) {
            return res.json({ message: 'Address is required!' })
        }
        if (!question) {
            return res.json({ message: 'Address is required!' })
        }

        // checking existing user
        const currentUser = await userModel.findOne({ email });

        if (currentUser) {

            return res.status(200).json({
                success: false,
                message: 'Account registered with this Email.Login to your account.'
            })

        }

        // if there is no user with this email, register him/her.
        const hashedPassword = await hashPassword(password);

        // saving the new user
        const newUser = await new userModel({ name, email, phone, address, password: hashedPassword, question }).save()

        res.status(201).json({
            success: true,
            message: "User Registered Succesfully",
            user: newUser
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while Registering',
            error
        })
    }
})


// For Logging the user In
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: 'Invalid User or Password'
            })
        }

        // check if user is present or not
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email is not registered.'
            })
        }

        // matching password
        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(200).json({
                success: false,
                message: 'Password is incorrect!!'
            })
        }

        // If password is matched, a token is created
        const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            success: true,
            message: 'Logged In Successfully.',
            user: {
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                address: user?.address,
                role: user?.role
            },
            token
        });

    } catch (error) {
        console.log(`Error while logging in ${error}`);
        res.status(500).json({
            success: false,
            message: 'Error while logging in',
            error
        })
    }
})

// forgot password
router.post('/forgotPassword', async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;

        if (!email) {
            return res.status(400).send({
                message: 'Email is required'
            })
        }
        if (!question) {
            return res.status(400).send({
                message: 'Question is required'
            })
        }
        if (!newPassword) {
            return res.status(400).send({
                message: 'New Password is required'
            })
        }

        const user = await userModel.findOne({ email, question });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Question'
            })
        }

        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
        return res.status(200).send({
            success: true,
            message: 'Password Reset Successful'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
})

// testing routes
router.get('/test', requireSignIn, isAdmin, (req, res) => {

    try {
        res.send({ message: "Protected Routes" });
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
})

// protected route (i.e. only open when signed in)
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})


// protected route (i.e. only admin can access it)
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

export default router;