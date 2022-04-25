const express =require('express')
const dotenv =require('dotenv')
const ProductRoute =require('./routes/ProductRoutes')
const UserRoute =require('./routes/UserRoute')
const OrderRoute=require('./routes/OredrRoute')
const ConnectDataBase =require('./config/database') 
const bodyparser =require('body-parser')
const errorMiddleware = require('./middlewares/error')


// Handling uncaughtException Errors

process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`)
    console.log("Shutting down the server due to unhcaught exception")
    server.close(()=>{
        process.exit(1)
    })
})

const app =express()
dotenv.config({path:"Backend/config/config.env"})



// Connecting database
ConnectDataBase()


const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})
app.use(bodyparser.json())


// Import Routes

app.use("/api/v1",ProductRoute)
app.use("/api/v1",UserRoute)
app.use("/api/v1",OrderRoute)


// Middleware for error

app.use(errorMiddleware)


// handling unhandledRejection Errors

process.on("unhandledRejection",err=>{
    console.log(`Error ${err.message}`)
    console.log("Shutting down the server due to unhandled rejection")
    server.close(()=>{
        process.exit(1)
    })
})