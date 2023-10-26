require("dotenv").config();
const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);

const auth = async (req, res, next) => {
  try {
    const  authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res.status(401).send("token can be provide");
    }
    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send("Invalid authorization header");
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decode._id });
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = auth;

