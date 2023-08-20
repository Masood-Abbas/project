const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)
const bcrypt=require(`bcrypt`)

const router=express.Router()
const nodemailer = require('nodemailer');



// Register user
router.post("/registration",async(req,res)=>{
try {
    const {employe_no,first_name,last_name,email,employe_type,category,password,profile_img}=req.body
      const newUser=new user({
        employe_no,first_name,last_name,email,employe_type,category,password,profile_img
    })
    const result=await newUser.save()
    const token = await newUser.generateAuthToken();
    const data = { token };
    // Email
     // Create a Nodemailer transporter using SMTP
     const transporter=nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:"a86094305@gmail.com",
        pass:"ebuppjsrpobpfadt"
      }
    })
    // Email options
    const mailOptions={
      from:"a86094305@gmail.com",
      to: email,
      subject:"information",
      text:`Employe_No: ${employe_no}
            First Name: ${first_name}
            Last Name: ${last_name}
            Email: ${email}
            Employe-type: ${employe_type}
            Catgory: ${category}
            password: ${password}
            Profile_img: ${profile_img}`
    }
    // send email
    transporter.sendMail(mailOptions,(error,info)=>{
      if (error) {
        return res.status(500).send(`error occure sending mail`)
      } else {
        console.log('Email sent: ' + info.response);
         res.status(201).send(`Email send successly` )
      }
    })

    res.send(data);
} catch (error) {
  res.status(404).send(`invalid details`) 
  console.log(error)
}
})

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
        res.status(404).send(`invalid login`)
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