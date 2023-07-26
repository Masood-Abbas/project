const mongoose=require(`mongoose`)

mongoose.connect(`mongodb://127.0.0.1:27017/registration`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log(`connection sussefull`);
}).catch((e)=>{
    console.log(e);
})