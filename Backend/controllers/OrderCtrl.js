const ErrorHandler = require('../Utils/ErrorHandler')
const catchAsyncErrors = require('../Utils/catchAsyncErrors')
const OrderModel =require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')




// creating a new order

exports.NewOrder =catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,paidAt,totalPrice,shippingPrice,taxPrice,orderStatus} =req.body
    const order =await OrderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        paidAt,
        totalPrice,
        shippingPrice,
        taxPrice,
        orderStatus,
        user:req.user._id
    })
    res.status(201).json({
        success:true,
        order
    })
})


// get user orders 

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const order = await OrderModel.find({user:req.user._id}).populate("user","name email")
    if(!order){
        next(new ErrorHandler("connot find order with this id"))
    }
    res.status(200).json({
        success:true,
        order
    })
});



//get single order  --Admin

exports.getSingleOrder =catchAsyncErrors(async(req,res,next)=>{
    const order= await OrderModel.findById(req.params.id).populate("user","name email")

    if(!order){
        next(new ErrorHandler("cannot find order with this id",400))
    }
    res.status(200).json({
        success:true,
        order
    })
});



// get all orders  --Admin

exports.getAllOrders =catchAsyncErrors(async(req,res,next)=>{
    const orders =await OrderModel.find()

    if(!orders){
        next(new ErrorHandler("cannot get orders"))
    }
    totalAmount=0
    orders.forEach((order)=>
    totalAmount +=orders.totalPrice)
    
    res.status(200).json({
        success:true,
        orders,
        totalAmount  
    })
});




//delete order --Admin

exports.deleteOrder =catchAsyncErrors(async(req,res,next)=>{
    const order =await OrderModel.findById(req.params.id)

    await order.remove()
    res.status(200).json({
        success:true,
    })
});



// update order --Admin

exports.UpdateOrder =catchAsyncErrors(async(req,res,next)=>{
    const order =await OrderModel.findById(req.params.id)

    if(order.orderStatus === "delivered"){
        next(new ErrorHandler("you have already delivered this product",400))
    }
    order.orderItems.forEach(async(order)=>
    await UpdateStock(order.product,order.quantity )
    )
    order.orderStatus =req.body.status

    if(order.orderStatus==="delivered"){
         order.deliveredAt =Date.now()

    }
    await order.save({validateBeforeSave :false})
    res.status(200).json({
        success:true
    })
});


async function UpdateStock(id,quantity){
    const product =await ProductModel.findById(id)

    product.stock = quantity

    product.save({validateBeforeSave:false})

};