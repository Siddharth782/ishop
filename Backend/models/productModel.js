import mongoose from "mongoose";

// used for defining the input forms for User
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.ObjectId, // generated offically by mongoose
        ref: 'Category', // this should be same as the name given in the object model
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },
    shipping: {
        type: Boolean
    }
}, { timestamps: true })

export default mongoose.model('Products', productSchema)