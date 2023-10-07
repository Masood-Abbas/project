const express = require(`express`);
const Patient = require(`../../models/patient/patient`);

const router = express.Router();
// add new Patient
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, CNIC, gender, email, test } =
      req.body;
    const newPatient = new Patient({
      firstName,
      lastName,
      phoneNumber,
      CNIC,
      gender,
      email,
      test,
    });
    const result = await newPatient.save();
    res.status(200).send(result);
    console.log(result);
  } catch (error) {
    res.status(404).send(error);
    console.log(error);
  }
});
// get all patientes
router.get(`/`, async (req, res) => {
  try {
    const patients = await Patient?.find(
      {},
      "firstName lastName phoneNumber CNIC gender email test"
    );
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
module.exports = router;
