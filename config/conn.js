const mongoose=require(`mongoose`)
const DB=`mongodb+srv://masoodabbas:allah4mine@cluster0.nzci0so.mongodb.net/registration`
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log(`connection sussefull`);
}).catch((e)=>{
    console.log(e);
})
