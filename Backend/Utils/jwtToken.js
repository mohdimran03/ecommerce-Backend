const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

const getjwttoken =(user)=>{
   return  jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

const comparePassword =(userPassword,DbuserPassword)=>{
    return  bcrypt.compare(userPassword,DbuserPassword)
}




module.exports ={getjwttoken,comparePassword}


