const express=require(`express`)
const mongoose=require(`mongoose`)
const jwt=require("jsonwebtoken")

const userschema= new mongoose.Schema({
    employee_no:{
        type:Number,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    employe_type:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})
userschema.methods.generateAuthToken=async function(){
    try {
        const token=jwt.sign({_id:this._id.toString()},`SECRET_KEY`)
        this.tokens=this.tokens.concat({token})
        await this.save()
        return token;
    } catch (e) {
        // res.send(`error`+e)
        console.log(e);
    }
}

const user=new mongoose.model(`user`,userschema)

module.exports=user