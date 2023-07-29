// permission.js

const express = require('express');
const Permission = require('../models/permission');

const router = express.Router();

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

module.exports = router;
