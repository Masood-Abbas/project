const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  // Add other fields as needed
});

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
