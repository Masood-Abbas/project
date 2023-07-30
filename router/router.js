const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)
const bcrypt=require(`bcrypt`)

const router=express.Router()

// Register user
router.post("/registration",async(req,res)=>{
try {
      const newUser=new user({
        employe_no:req.body.employe_no,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        employe_type:req.body.employe_type,
        category:req.body.category,
        password:req.body.password
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
// Login user
router.post("/login",async(req,res)=>{
    try {
     const email=req.body.email
     const password=req.body.password
     const usera=await user.findOne({email})
     if (!usera) {
      res.status(404).send('User not found');
      } else {
        const isMatch=await bcrypt.compare(password,usera.password)
        if (isMatch) {
          const token = await usera.generateAuthToken();
          const data = { token };
          res.send(data);
          console.log(usera);
        }else {
            res.status(404).send("invalid password")
     res.send(usera)
    }
  }
}
    catch (error) {
        res.status(404).send(`invali login`)
        console.log(error)
    }
})
// update user

router.patch(`/registration`,async(req,res)=>{
  

try {
  const employe_no=req.body.employe_no
  const updateUser=await user.findOneAndUpdate({employe_no},req.body,{
    new:true
  })
  if(!updateUser){
    res.status(404).send('User not found');
  }
  res.send(updateUser)
} catch (error) {
  res.status(500).send(`invalid`)
  console.log(error)
}
})


// router.post("/",async(req,res)=>{
//     const newUser=new Register(req.body)
//    const result=await newUser.save()
//    res.send(result)
//    console.log(result);
// })

//Admin login 
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