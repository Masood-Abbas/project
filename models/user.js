const express=require(`express`)
const mongoose=require(`mongoose`)
const jwt=require("jsonwebtoken")

const userschema= new mongoose.Schema({
    employee_no:{
        type:Number,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    first_name:{
        type:String,
        },
    last_name:{
        type:String,
        },
    email:{
        type:String,
        unique:true
    },
    employe_type:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        },
    password:{
        type:String,
        },
    tokens:[{
        token:{
           type:String,
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
  
        console.log(e);
    }
}
const user=new mongoose.model(`user`,userschema)
module.exports=user
