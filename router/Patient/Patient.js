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
      const { firstName, lastName, phoneNumber, CNIC, gender, email, test } = req.body;
      const newPatient = new Patient({
        id: newId,
        firstName,
        lastName,
        phoneNumber,
        CNIC,
        gender,
        email,
        test,
      });
  
      // Save the new patient record
      const result = await newPatient.save();
  
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
        text: `${firstName} ${lastName}'s blood has been collected`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          // Handle the error and respond to the client
          res.status(500).json({ error: "Error sending email" });
        } else {
          console.log("Email sent:", info.response);
          // Send the success response to the client
          res.status(201).json({ message: "Email sent successfully" });
        }
      });
    } catch (error) {
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
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    let results;
    if (!query) {
      results = await Patient.find({});
    } else {
      results = await Patient.find({
        $or: [
          { firstName: { $regex: new RegExp(query, 'i') } },
        ],
      });
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
