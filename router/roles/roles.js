// router.js
const express = require('express');
const Role=require('../../models/roles')
const router = express.Router();

// Create a new item
router.post('/', async (req, res) => {
  try {

    const latestRole = await Role.findOne().sort({ id: -1 });
    const newId = latestRole ? latestRole.id + 1 : 1;
    const newRole = new Role({
      name: req.body.name,
      id: newId,
      permissions:req.body.permissions
    });

    await newRole.save();

    res.json({message:'Role created successful!'});


  } catch (error) {
    res.status(500).json({ error: 'Error creating item' });
  }
});


router.get('/', async (req, res) => {
  try {
    const items = await Role.find({},'name permissions id');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});



router.patch('/:id', async (req, res) => {
  try {
    const titleId = req.params.id;
      const newName = req.body.name;
      const newPermissions=req.body.permissions
      

      const updatedRole = await Role.findOneAndUpdate(
        { id: titleId },
        { name: newName ,permissions:newPermissions},
        { new: true }
      );


      if (!updatedRole) {
        return res.status(404).json({ message: 'Title not found' });
      }
  
      res.status(200).json({ message: 'Role updated successfully' })
  
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

router.delete('/:id', async (req, res) => {
    try {
        const id=String(req.params.id)
        const deletedItem = await Role.findOneAndDelete(id);
        if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Role deleted successfully!' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting item' });
      }
});

module.exports=router;