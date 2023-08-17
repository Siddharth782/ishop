import express from 'express';
const router = express.Router();
import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleWare.js';

// creating routes for auth(Registering User)
router.post('/register', async (req, res) => {
    try {
        // we get all these from form submitted by user while registering
        const { name, email, password, address, phone } = req.body;

        // validation checks
        if (!name) {
            return res.json({ error: 'Name is required!' })
        }
        if (!email) {
            return res.json({ error: 'Email is required!' })
        }
        if (!password) {
            return res.json({ error: "Password can't be empty!" })
        }
        if (!phone) {
            return res.json({ error: 'Phone is required!' })
        }
        if (!address) {
            return res.json({ error: 'Address is required!' })
        }

        // checking existing user
        const currentUser = await userModel.findOne({ email });

        if (currentUser) {

            return res.status(200).json({
                success: true,
                message: 'Already Registered with this Email. Try another one or LogIn to your account.'
            })

        }

        // if there is no user with this email, register him/her.
        const hashedPassword = await hashPassword(password);

        // saving the new user
        const newUser = await new userModel({ name, email, phone, address, password: hashedPassword }).save()

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
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
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

// testing routes
router.get('/test', requireSignIn, isAdmin, (req, res) => {

    try {
        res.send({ message: "Protected Routes" });
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
})


export default router;