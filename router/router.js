const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)

const router=express.Router()
router.post("/",async(req,res)=>{
try {
      const newUser=new user({
        employe_no:req.body.employe_no,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        employe_type:req.body.employe_type,
        category:req.body.category
    })
    const result=await newUser.save()
    const token = await newUser.generateAuthToken();
    const data = { token };
    res.send(data);
} catch (error) {
  res.status(404).send(`invalid details`) 
  console.log(error)
}
})
// for check the above api
// router.post("/login",async(req,res)=>{
//     try {
//      const email=req.body.email
//     //  const password=req.body.password
//      const usera=await user.findOne({email})
//      res.send(usera)
//     }
//     catch (error) {
//         res.status(404).send(`invalid login`)
//         console.log(error)
//     }
// })

// router.post("/",async(req,res)=>{
//     const newUser=new Register(req.body)
//    const result=await newUser.save()
//    res.send(result)
//    console.log(result);
// })

router.post("/login",async(req,res)=>{
   try {
    const username=req.body.username
    const password=req.body.password
    const user=await Register.findOne({username})

    if (!user) {
        res.status(404).send('User not found');
      } else {
        if (user.password === password) {
          const token = await user.generateAuthToken();
          const data = { token };
          res.send(data);
        } else {
          res.status(404).send('User not found');
        }
      }
} catch (error) {
    res.status(404).send(`invalid login`)
}
})


module.exports=router;
