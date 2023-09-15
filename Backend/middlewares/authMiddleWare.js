import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

// Protected routes - token based

// we will get 'req', then 'next' will be validated then we will send 'res'

export const requireSignIn = async (req, res, next) => {

    try {

        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode; // we won't get Id till we do this
        next();
    } catch (error) {
        // console.log(error);
    }

}

// admin access 
export const isAdmin = async (req, res, next) => {

    try {
        const user = await userModel.findById(req.user._id);
        // the user we r getting from /login

        if (user.role !== 1) {
            return res.status(401).json({
                success: false,
                message: 'UnAuthorized Access'
            })
        }
        else {
            next();
        }

    } catch (error) {
        // console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Error in admin middleware',
            error
        })
    }
}