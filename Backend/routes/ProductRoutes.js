const express =require('express')
const router =express.Router()


const {getproducts,createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getAllReviews, DeleteReview, GetAllReviews, DeleteProductReview} =require('../controllers/ProductCtrl.js')
const Auth =require('../middlewares/Auth')


router.get('/products',getproducts)

router.post('/products/new',Auth.isAuthenticatedUser,createProduct)


router.put('/products/:id',Auth.isAuthenticatedUser,Auth.AuthorizeRole("admin"),updateProduct)
router.delete('/products/:id',Auth.isAuthenticatedUser,Auth.AuthorizeRole("admin"),deleteProduct)
router.get('/products/:id',Auth.isAuthenticatedUser,Auth.AuthorizeRole("admin"),getProductDetails)

router.put("/review",Auth.isAuthenticatedUser,createProductReview)

router.get('/reviews',GetAllReviews)

router.delete('/reviews',Auth.isAuthenticatedUser,DeleteProductReview)


module.exports =router 