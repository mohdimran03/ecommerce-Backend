const mongoose =require('mongoose')




const ConnectDataBase =()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("connected with database"))
}

module.exports =ConnectDataBase