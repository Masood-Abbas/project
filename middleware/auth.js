require("dotenv").config();
const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());
const auth = async (req, res, next) => {
    const token=req.headers[`x-auth-token`]
    if(!token) return res.status(401).send(`not token`)
  try {
    const decode=jwt.verify(token, process.env.SECRET_KEY);
    req.user=decode
    next()
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
module.exports = auth;
