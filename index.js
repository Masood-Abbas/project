require('dotenv').config();
const express=require(`express`)
const router=require(`./router/router`)
const cors = require('cors');
const path=require(`path`)
const cookieParser = require('cookie-parser');
// connection db 
require(`./config/conn`)
const app=express()
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const port =process.env.PORT|| 5000
app.use(express.json())
app.use(router)

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})