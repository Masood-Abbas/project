const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)
const bcrypt=require(`bcrypt`)

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
   
    // const token=await user.generateAuthToken()
    // console.log(`the success part`+token);
} catch (error) {
  res.status(404).send(`invalid details`) 
}
})

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


//Admin login 
router.post("/login",async(req,res)=>{
   try {
    const username=req.body.username
    const password=req.body.password
    const user=await Register.findOne({username})

    const token=await user.generateAuthToken()
    console.log(`the success part`+token);
    if(user.password===password){
        // res.send(user)
        res.send("success")
    }else{
        res.send("invalid detail")
    }
} catch (error) {
    res.status(404).send(error)
}
})


router.post('/register', async (req, res) => {
    try {
      const {
        employee_no,
        first_name,
        last_name,
        email,
        employe_type,
        category,
        password
      } = req.body;

      console.log(req.body)

      const existingUserEmployeeNo = await User.findOne({
        $or: [{ employee_no }]
        });
        const existingUserEmail = await User.findOne({
            $or: [{ email }]
            });

        if (existingUserEmployeeNo?.employee_no) {
            return res.status(409).json({ message: 'User with same employee_no already exists' });
          }
          if (existingUserEmail?.employee_no) {
            return res.status(409).json({ message: 'User with same email already exists' });
          }
      
  
      const newUser = new User({
        employee_no,
        first_name,
        last_name,
        email,
        employe_type,
        category,
        password
      });

     
      await newUser.save();
      res.status(200).json({ message:'User created successfully.' });
    } catch (error) {
      res.status(400).json({ message:  error.message });
    }
  });
  
router.use('/permission', permissionRoute);
router.use('/titles',titleRoute)


module.exports=router;
