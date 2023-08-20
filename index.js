const express=require(`express`)
const router=require(`./router/router`)
const cors=require(`cors`)
// connection db 
require(`./config/conn`)
const app=express()
const port =process.env.PORT|| 5000
// middleware
app.use(express.json())
app.use(router)
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})