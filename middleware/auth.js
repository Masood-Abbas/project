const jwt = require(`jsonwebtoken`);
const User = require(`../models/user`);
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send(`Unauthorization please provide a token`);
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decode._id });
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = auth;


