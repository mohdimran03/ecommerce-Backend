const mongoose =require('mongoose')
const validator =require('validator')
const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')

const UserModel = mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength :[30,"name cannot exceed 30 characters"],
        minLength:[4,"name should be 4 characters long"]
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"please enter a password"],
        minLength:[8,"password must be 8 characters long"],
        select:false
    },
    avatar:{
        
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        role:{
            type:String,
            default:"user"
        }   
});





UserModel.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }

    this.password =await bcrypt.hash(this.password,5)
})

UserModel.methods.getjwttoken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}





module.exports = mongoose.model("user",UserModel)

