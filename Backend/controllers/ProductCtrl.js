const ProductModel =require('../models/ProductModel')
const ErrorHandler = require('../Utils/ErrorHandler')
const catchAsyncErrors = require('../Utils/catchAsyncErrors')
const AppFeatures = require('../Utils/AppFeatures')



// Get all products

exports.getproducts =catchAsyncErrors(async(req,res)=>{
    const pagesize = 4
    const productCount =await ProductModel.countDocuments()
   const appfeatures =new AppFeatures(ProductModel.find(),req.query)
       .Search()
       .Filter()
       .pagination(pagesize)
    const products =await appfeatures.query
    res.status(200).json({
        success:true,
        products,
        productCount
    })
})

// create product --Admin

exports.createProduct =catchAsyncErrors(async(req,res,next)=>{
    const product =await ProductModel.create(req.body)
    res.status(201).json({
        succes:true,
        product
    })
})

//update product --Admin

exports.updateProduct =catchAsyncErrors(async(req,res,next)=>{
    let product =await ProductModel.findById(req.params.id)
    
    if(!product){
         return next( new ErrorHandler("product not found",404))
    }
    
     product =await ProductModel.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true,
         useFindAndMdify:false

     })

     res.status(201).json({
         success:true,
         product
     })

})

// delete product --Admin

exports.deleteProduct =catchAsyncErrors(async(req,res,next)=>{
    const product =await ProductModel.findById(req.params.id)
    
    if(!product){
       return next(new ErrorHandler("product not found",404))
    }
    product.remove()

    res.status(201).json({
        success:true,
        message:"Product deleted Successfully"
    })

})

// delete product --Admin 

exports.getProductDetails =catchAsyncErrors(async(req,res,next)=>{
    const product =await ProductModel.findById(req.params.id)
    if(!product){
       return next(new ErrorHandler("product not found",404))
    }
    res.status(200).json({
        success:true,
        product
    })
})

// create new review or update review

exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {comment,rating,productid}= req.body

    const review ={
        user:req.user_id,
        name:req.user.name,
        comment ,
        rating:Number(rating)
    }
    const product =await ProductModel.findById(productid)
    console.log(product.reviews)

    const isreviewed = product.reviews.find( rev => rev._id.toString()===req.user._id.toString())
    if(isreviewed){
        product.reviews.forEach(rev =>{
            if(rev.user.toString()=== req.user._id.toString())
            (rev.rating =rating),(rev.comment= comment )
            
        })

    }else{
        product.reviews.push(review)
        product.numofreviews = product.reviews.length
    }

   let avg= 0

   product.ratings = product.reviews.forEach(rev => {
       avg += rev.rating
   })/product.reviews.length

   await product.save({
       validateBeforeSave:false
   })

    res.status(200).json({
        success:true
    })

})

exports.GetAllReviews =catchAsyncErrors(async(req,res,next)=>{
    const product =await ProductModel.findById(req.query.productid)

    if(!product){
        next(new ErrorHandler("connot get the product",400))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

exports.DeleteProductReview =catchAsyncErrors(async(req,res,next)=>{
    const product =await ProductModel.findById(req.query.productid)

    if(!product){
        next(new ErrorHandler("cannot get reviews"))
    }

     const reviews = product.reviews.filter((rev)=> rev._id.toString()!== req.query.id.toString())

    let avg= 0
    reviews.forEach(rev =>{
        avg += rev.rating
    })

    const ratings =avg/reviews.length
    const numofreviews =reviews.length

    await ProductModel.findByIdAndUpdate(req.query.productid,{
        reviews,
        ratings,
        numofreviews
    },{
        new:true,
        runValidators:true,
        useFindAndMdify:false
    })

    res.status(200).json({
        success:true,
        message:"review deleted"
    })

   
})








