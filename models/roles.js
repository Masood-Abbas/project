const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    permissions: {
      type: [Number],
      required: true,
    },
  });
  
  const Role = mongoose.model('Role', roleSchema);



module.exports = Role;
