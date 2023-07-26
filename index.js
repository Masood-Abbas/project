const express=require(`express`)
const router=require(`./router/router`)

// connection db 
require(`./config/conn`)
const app=express()
const port =process.env.PORT|| 5000
app.use(express.json())
app.use(router)

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})