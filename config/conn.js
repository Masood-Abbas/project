const mongoose=require(`mongoose`)
const DB=`mongodb+srv://masoodabbas:allah4mine@cluster0.nzci0so.mongodb.net/registration`
<<<<<<< HEAD
=======

>>>>>>> d3e48c881a2151f8fb043b90a195a5943791e2bc
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log(`connection sussefull`);
}).catch((e)=>{
    console.log(e);
})
