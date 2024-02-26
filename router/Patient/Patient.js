require("dotenv").config();
const express = require(`express`);
const Patient = require(`../../models/patient/patient`);
const nodemailer = require("nodemailer");

const router = express.Router();
// add new Patient

router.post("/", async (req, res) => {
  try {
   
    const latestPatient = await Patient.findOne().sort({ id: -1 });
    const newId = latestPatient ? latestPatient.id + 1 : 1;
    const {
      firstName,
      lastName,
      phoneNumber,
      pdfName,
      CNIC,
      gender,
      reportStatus,
      age,
      email,
      test,
    } = req.body;
    const existingPdf = await Patient.findOne({pdfName});
    if (existingPdf) {
      return res.status(400).json({ msg: "Pdf already exist" });
    }
    const newPatient = new Patient({
      id: newId,
      firstName,
      lastName,
      phoneNumber,
      reportStatus,
      age,
      pdfName,
      CNIC,
      gender,
      email,
      test,
    });

    const result = await newPatient.save();
    res.send("Reqested accept successfully");

    // Send the email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Information",
      text: `Dear ${firstName} ${lastName}

        We hope this message finds you well. We want to inform you that your recent test data has been successfully collected. Ensuring the accuracy and completeness of your health information is crucial for providing you with the best care possible.
        
        Here are some details regarding your test data:
        
        - Test Type: ${test}
        Thank you for choosing our healthcare services. We appreciate the opportunity to contribute to your health and well-being.
        Best regards, `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        // Send the success response to the client
        res
          .status(201)
          .json({ message: "Email sent successfully and save the data" });
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("pdf alrady exist");
    }
    console.error(error);
    res.status(404).json({ error: "An error occurred" });
  }
  
});
// get all patientes
router.get(`/`, async (req, res) => {
  try {
    const patients = await Patient?.find({});
    if (patients?.length) {
      res.send(patients);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});
// get by id
router.get(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const patients = await Patient?.find({ id: id });
    if (patients?.length) {
      res.send(patients);
    } else {
      res.send(`Patient are not found`);
    }
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});
// delete the patient
router.delete(`/:id`, async (req, res) => {
  try {
    const patientId = req.params.id;
    const deletePatient = await Patient.findOneAndDelete({ id: patientId });
    if (!deletePatient) {
      res.status(404).send(`user not found`);
    } else {
      res.status(200).send(`delete successly`);
    }
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});
router.get("/get/search", async (req, res) => {
  const query = req.query.q;
  try {
    let results;
    if (!query) {
      results = await Patient.find({});
    } else {
      results = await Patient.find({
        $or: [{ firstName: { $regex: new RegExp(query, "i") } }],
      });
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
