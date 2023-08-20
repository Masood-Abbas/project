const mongoose=require(`mongoose`)
const jwt=require("jsonwebtoken")
const bcrypt=require(`bcrypt`)


const userschema= new mongoose.Schema({
    employe_no:{
        type:Number,
<<<<<<< HEAD
        unique:true
=======
        // unique:true
>>>>>>> feature/update-api
    },
    first_name:{
        type:String,
        },
    last_name:{
        type:String,
        },
    email:{
        type:String,
<<<<<<< HEAD
        unique:true
=======
        // unique:true
>>>>>>> feature/update-api
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
<<<<<<< HEAD
=======
    profile_img:{
        type:String,
        default: '/default-profile-img.png'
        },
>>>>>>> feature/update-api
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
        // await this.save()
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