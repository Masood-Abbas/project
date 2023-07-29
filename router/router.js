const express=require(`express`)
const Register=require(`../models/register`)
const Permission =require('../models/permission')
const router=express.Router()
const permissionRouter = require('./permission');

router.post("/login",async(req,res)=>{
   try {
    const username=req.body.username
    const password=req.body.password
    const user=await Register.findOne({username})

    const token=await user.generateAuthToken()
    console.log(`the success part`+token);
    if(user.password===password){
        // res.send(user)
        res.send("success")
    }else{
        res.send("invalid detail")
    }
} catch (error) {
    res.status(404).send(error)
}
})


module.exports=router;
