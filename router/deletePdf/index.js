const express = require(`express`);
const router = new express.Router();
const path=require(`path`)
const fs=require(`fs`)

router.post('/', (req, res) => {
 try {
    let name = req.body.name; 
    pdfname= `${name}.pdf`
    const pdfFilePath = path.join(__dirname, `../../public/pdf`, pdfname);

    if (fs.existsSync(pdfFilePath)) {
        // Delete the PDF file
        fs.unlinkSync(pdfFilePath);
        res.json({ message: `Deleted PDF file: ${pdfname}` });
    } else {
        res.status(404).json({ message: `PDF file not found: ${pdfname}` });
    }
 } catch (error) {
    console.log(error);
    res.status(500).json({message:`server error`,error})
 }
});
module.exports=router