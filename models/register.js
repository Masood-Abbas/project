const mongoose=require(`mongoose`)
const jwt=require("jsonwebtoken")

const client= new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})

client.methods.generateAuthToken=async function(){
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
const Register=new mongoose.model(`Register`,client)

module.exports=Register