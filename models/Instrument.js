const mongoose=require(`mongoose`)

const instrumentSchema =new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    createdAt:{
         type: Date, 
         default: Date.now 
        }
})
const Instrument =mongoose.model(`Instruments `,instrumentSchema)

module.exports=Instrument;