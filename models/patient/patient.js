const mongooes=require(`mongoose`)

const patientSchema=new mongooes.Schema({
    id:{
        type:Number,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    pdfName:{
        type:String,
        unique: true,
    },
    CNIC:{
        type:String,
    },
    gender:{
        type:String,
    },
    email:{
        type:String,
    },
    test:{
        type:String,
    },
    reportStatus:{
        type:String,
        default:"pending"
    },
    age:{
        type:Number,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    } 

})
const Patient=mongooes.model(`Patient`,patientSchema)
module.exports=Patient;