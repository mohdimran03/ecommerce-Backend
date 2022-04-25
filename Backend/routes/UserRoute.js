const express =require('express')
const router =express.Router()
const {RegisterUser,LoginUser, getUserDetails, UpdateUserProfile, UpdateUserPassword, getAllUsers, getSingleUser, UpdateUserRole, deleteUser} =require('../controllers/UserCtrl')
const Auth =require('../middlewares/Auth')




router.post('/register',RegisterUser)
router.post('/login',LoginUser)
router.get('/me',Auth.isAuthenticatedUser,getUserDetails)
router.put('/me/update',Auth.isAuthenticatedUser,UpdateUserProfile)
router.put('/password/update',Auth.isAuthenticatedUser,UpdateUserPassword)
router.get('/admin/users',Auth.isAuthenticatedUser,getAllUsers)
router.get('/admin/users/:id',Auth.isAuthenticatedUser,getSingleUser)
router.delete('/admin/users/:id',Auth.isAuthenticatedUser,deleteUser)
router.put('/admin/users/:id',Auth.isAuthenticatedUser,UpdateUserRole)









module.exports =router
