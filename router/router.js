const express=require(`express`)
const Register=require(`../models/register`)
const user=require(`../models/user`)
const bcrypt=require(`bcrypt`)
const permissionRoute=require('./permission')
const router=express.Router()
const titleRoute=require('./title/title')
const roleRoute=require('./roles/roles')
const instrumentRouter=require('./Instrument/Instrument')

// Register user
router.post("/registration",async(req,res)=>{
try {
    const {employeeNo,firstName,lastName,email,employeeType,category,password,profileImg}=req.body
      const newUser=new user({
        employe_no:req.body.employe_no,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        employe_type:req.body.employe_type,
        category:req.body.category,
        password:req.body.password,
        profile_img:req.body.profile_img
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
            Employe-type: ${employeType}
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
        }else {
            res.status(404).send("invalid password")
     res.send(usera)
    }
  }
}
    catch (error) {
        res.status(404).send(`invali login`)
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
router.use('/roles',roleRoute)
router.use(`/instrument`,instrumentRouter)


module.exports=router;
