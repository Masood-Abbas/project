const express = require('express');
const router=express.Router()
const path = require('path');


const publicFolder = path.join(__dirname,`../../public/pdf`);


router.post('/', (req, res) => {
   try {
    const {name}=req.body
    const pdfFileName = `${name}.pdf`; 

    res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`);
    res.setHeader('Content-Type', 'application/pdf');


    res.sendFile(path.join(publicFolder, pdfFileName));
   } catch (error) {
    res.json({message:"Not Found such report!"})
    console.log(error);
   }
});
module.exports=router