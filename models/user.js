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

// hashing password
userschema.pre(`save`,async function(next){
    if (this.isModified(`password`)) {
      this.password=await bcrypt.hash(this.password,10);
      this.Confirm_Password=await bcrypt.hash(this.password,10);
    }
    next()
})

const user=new mongoose.model(`user`,userschema)
module.exports=user
