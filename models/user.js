const mongoose = require(`mongoose`);
const jwt = require("jsonwebtoken");
const bcrypt = require(`bcrypt`);

const userschema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  employeeNo: {
    type: Number,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  employeeType: {
    type: String,
  },
  category: {
    type: String,
  },
  password: {
    type: String,
  },
  titles: {
    type: [Number],
  },
  roles: {
    type: [Number],
  },
  phoneNumber: {
    type: Number,
  },
  profileImg: {
    type: String,
    default: "/default-profile-img.png",
  },
});
1;
userschema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    return token;
  } catch (e) {
    console.log(e);
  }
};

// hashing password
userschema.pre(`save`, async function (next) {
  if (this.isModified(`password`)) {
    this.password = await bcrypt.hash(this.password, 10);
    this.Confirm_Password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = new mongoose.model(`user`, userschema);
module.exports = user;
