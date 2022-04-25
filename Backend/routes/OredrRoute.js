const express =require('express')
const router= express.Router()
const Auth =require('../middlewares/Auth')

const {NewOrder, myOrders, getSingleOrder, getAllOrders, deleteOrder, UpdateOrder} =require('../controllers/OrderCtrl')

router.post('/order/new',Auth.isAuthenticatedUser,NewOrder)

router.get('/orders/myorders',Auth.isAuthenticatedUser,myOrders)
router.get('/orders/:id',Auth.isAuthenticatedUser,getSingleOrder)
router.delete('/orders/:id',Auth.isAuthenticatedUser,deleteOrder)

router.get('/admin/orders',Auth.isAuthenticatedUser,getAllOrders)

router.put('/admin/orders/:id',UpdateOrder)



module.exports =router


