const express=require(`express`)
const Register=require(`../models/register`)

const router=express.Router()

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
    res.status(404).send(error)
}
})


module.exports=router;