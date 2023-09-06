const express = require(`express`);
const Instrument = require(`../../models/Instrument`);
const router = express.Router();

// Create an Instrument
router.post(`/`, async (req, res) => {
  try {
    const latestInstrument = await Instrument.findOne().sort({ id: -1 });
    const newId = latestInstrument ? latestInstrument.id + 1 : 1;
    const newInstrument = new Instrument({
      id: newId,
      name: req.body.name,
      quantity: req.body.quantity,
    });
    const result = await newInstrument.save();
    res.status(201).send(newInstrument);
  } catch (error) {
    res.send(error);
  }
});

// show all the instrument

router.get("/", async (req, res) => {
  try {
    const instrument = await Instrument.find({}, req.body);
    if (instrument?.length) {
      res.send(instrument);
    } else {
      res.send("instrument are not found");
    }
  } catch (error) {
    res.status(500).send(`internal error`);
  }
});

// update instrument

router.patch(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const updateInstrument = await Instrument.findOneAndUpdate(
      { id },
      req.body,
      { new: true }
    );
    if (!updateInstrument) {
      return res.status(404).send(`instrument not found`);
    } else {
      return res.status(201).send(`instrument updated successfully`);
    }
  } catch (error) {
    res.send(`server error`);
    Console.log(error);
  }
});

// delete instrument

router.delete(`/:id`,async(req,res)=>{
try {
    const id=req.params.id
    const deleteInstrument= await Instrument.findOneAndDelete({id})
    if(!deleteInstrument){
        return res.status(404).send(`instrument not found`)
    }else{
        return res.status(201).send(`instrument deleted successfully'`)
    }
} catch (error) {
    res.send("server error")
}
})
module.exports = router;
