const express=require(`express`)
const Register=require(`../models/register`)
const User=require('../models/user')
const Permission =require('../models/permission')
const router=express.Router()
const permissionRoute = require('./permission');
const nodemailer = require('nodemailer');



router.get('/users', async (req, res) => {
    try {
      const users = await User?.find({}, 'first_name last_name category email employee_no employe_type id');
    
      if (users?.length) {
        res.json(users);
      } else {
        res.status(404).send('users not found');
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  });


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


module.exports=router;
