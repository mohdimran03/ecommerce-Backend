const ErrorHandler =require('../Utils/ErrorHandler')
const catchAsyncErrors =require('../Utils/catchAsyncErrors')
const UserModel = require('../models/UserModel')
const jwtToken =require('../Utils/jwtToken')
const { json } = require('express/lib/response')


// Register User

exports.RegisterUser =catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password }  = req.body
    const user = await UserModel.create({
        name,
        email,
        password,
        avatar:{
            public_id:"sample ID",
            url:"sample url"
        }
    })
    
    const token   =  jwtToken.getjwttoken(user)

    res.status(201).json({
        success:true,
      token
    })
})


// Login user

exports.LoginUser =catchAsyncErrors(async(req,res,next)=>{

    const {email,password} =req.body

    //checking if user entered both email and password

    if(!email ||!password){
        return next(new ErrorHandler("Please enter email and password",400))
    }

    const Dbuser =await UserModel.findOne({email}).select("+password")
    if(!Dbuser){
        return next(new ErrorHandler("Invalid email or password"))
    }

    const isPasswordMatched = await jwtToken.comparePassword(password,Dbuser.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email and password"))
    }


    const token = jwtToken.getjwttoken(Dbuser)


    res.status(200).json({
        success:true,
        token
    })

});


// Update password for user

exports.UpdateUserPassword =catchAsyncErrors(async(req,res,next)=>{
    const user = await UserModel.findById(req.user.id).select("+password")

    const isPasswordMatched = jwtToken.comparePassword(req.body.oldpassword,user.password)

    if(!isPasswordMatched){
       return  next(new ErrorHandler("your old password is incorrrect",400))
    }

    if(req.body.newpassword !== req.body.confirmnewpassword){
        return next(new ErrorHandler("new password does not match",400))
    }

    user.password = req.body.newpassword
    await user.save()


    res.status(200).json({
        success:true,
        user
    })



})



// Update profile for User

exports.UpdateUserProfile =catchAsyncErrors(async(req,res,next)=>{
    const Newdata ={
       name: req.body.name,
       email:req.body.email
    }

    const user =await UserModel.findByIdAndUpdate(req.user.id,Newdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        user
    })

});



// get user details for user

exports.getUserDetails =catchAsyncErrors(async(req,res,next)=>{
    const user  =await UserModel.findById(req.user.id)
    if(!user){
        return  next(new ErrorHandler("unable to find user",400))
    }
    res.status(200).json({
        success:true,
        user
    })
})



// Get all users --Admin

exports.getAllUsers =catchAsyncErrors(async(req,res,next)=>{
    const users = await UserModel.find()

    if(!users){
       return next(new ErrorHandler("users does not exist",400))
    }
    res.status(200).json({
        success:true,
        users
    })

})



// get single user  --Admin

exports.getSingleUser =catchAsyncErrors(async(req,res,next)=>{
    const user = await UserModel.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler("user does not exist"))
    }

    res.status(200).json({
        success:true,
        user
    })
})


// Update user role  --Admin

exports.UpdateUserRole =catchAsyncErrors(async(req,res,next)=>{
    const Newdata ={
       name: req.body.name,
       email:req.body.email,
       role:req.body.role
    }

    const user =await UserModel.findByIdAndUpdate(req.user.id,Newdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        user
    })

});



// delete user --Admin

exports.deleteUser =catchAsyncErrors(async(req,res,next)=>{
    const user  =await UserModel.findById(req.params.id)
    if(!user){
       return next(new ErrorHandler(`user does not exist with id:${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })

})
