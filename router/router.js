const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)
const bcrypt=require(`bcrypt`)

const router=express.Router()
const nodemailer = require('nodemailer');



// Register user
router.post("/registration",async(req,res)=>{
try {
    const {employeeNo,firstName,lastName,email,employeeType,category,password,profileImg}=req.body
      const newUser=new user({
        employeeNo,firstName,lastName,email,employeeType,category,password,profileImg
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
      text:`Employe No: ${employeeNo}
            First Name: ${firstName}
            Last Name: ${lastName}
            Email: ${email}
            Employe-type: ${employeeType}
            Catgory: ${category}
            password: ${password}
            Profile_img: ${profileImg}`
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
// update user

router.patch(`/registration`,async(req,res)=>{
  

try {
  const employeeNo=req.body.employeeNo
  const updateUser=await user.findOneAndUpdate({employeeNo},req.body,{
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