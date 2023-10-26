// permission.js

const express = require('express');
const Permission = require('../models/permission');

const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const latestPermission = await Permission.findOne().sort({ id: -1 });
    const newId = latestPermission ? latestPermission.id + 1 : 1;
    const newPermission = new Permission({
      name: req.body.name,
      id: newId,
    });
   const result= await newPermission.save();
   console.log(result);
    res.json({message:'Permission created successful!'});
  } catch (error) {
    res.status(500).json({ error: 'Error creating item' })
    console.log(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await Permission.find({}, 'name id');
    const permissions = users?.map((item) => {
      return { name: item?.name, id: item?.id };
    });
    if (permissions?.length) {
      res.json(permissions);
    } else {
      res.status(404).send('Permissions not found');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
});

// search API
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    let results;
    if (!query) {
      results = await Permission.find({});
    } else {
      results = await Permission.find({
        $or: [
          { name : { $regex: new RegExp(query, 'i') } },
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
