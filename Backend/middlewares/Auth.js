const bcrypt =require('bcrypt')
const catchAsyncErrors = require('../Utils/catchAsyncErrors')
const jwt =require('jsonwebtoken')
const ErrorHandler = require('../Utils/ErrorHandler')
const UserModel = require('../models/UserModel')


const isAuthenticatedUser =catchAsyncErrors(async(req,res,next)=>{

    const authheader =req.headers.authorization 
    if(!authheader){
       return  next(new ErrorHandler("Please login to access this resource",400))
    }
   
    const token = authheader.split(' ')
    const jwtToken = token[1]
    const decodedData =jwt.verify(jwtToken,process.env.JWT_SECRET)

    req.user = await UserModel.findById(decodedData.id)
    next()
})

const AuthorizeRole =(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`))
        }

        next()
    }
}






module.exports ={isAuthenticatedUser,AuthorizeRole}



