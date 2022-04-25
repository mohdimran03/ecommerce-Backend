const mongoose = require('mongoose')

const ProductScehema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
    },
    description: {
        type: String,
        required: [true, "please give the description"]
    },
    price: {
        type: Number,
        required: [true, "please enter the price"],
        maxLength: [8, "cannot exceeds 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "please enter the category"],
    },
    stock: {
        type: Number,
        default:0,
        required: [true, "please enter the stock"],
        maxLength: [4, "cannot exceeds 4 characters"]
    },
    numofreviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
           user:{
              type:mongoose.Schema.Types.ObjectId,
              ref:"user"
             
           },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
module.exports =mongoose.model('product',ProductScehema)