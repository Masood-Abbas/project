const express=require(`express`)
const Register=require(`../models/register`)
const User=require('../models/user')
const Permission =require('../models/permission')
const router=express.Router()
const permissionRouter = require('./permission');
const nodemailer = require('nodemailer');


router.get('/users', async (req, res) => {
    try {
      const users = await User?.find({}, 'first_name last_name category email employee_no status id');
    
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
        status,
        category,
        password
      } = req.body;

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
        status,
        category,
        password
      });

      const testAccount= await nodemailer?.createTestAccount()

      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'chelsie.stehr44@ethereal.email',
            pass: 'crN5qHdnkAVbVxZZpx'
        }
    });
  
      const token = await newUser.generateAuthToken();
      await newUser.save();
      const info = await transporter.sendMail({
        from: 'FypProject@gmail.com', // sender address
        to: email, 
        subject: "Create New Account", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });  
      console.log(info)
      res.status(201).json({ newUser, token });
    } catch (error) {
      res.status(400).json({ message:  error.message });
    }
  });
  


module.exports=router;
