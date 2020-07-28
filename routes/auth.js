const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
  //validating data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if account exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    //save new user in mongodb
    const savedUser = await user.save();
    res.send({ user: savedUser.id });
  } catch (error) {
    res.status(400).send(err);
  }
});

//login
router.post("/login", async (req, res) => {
  //validating data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check exist emails
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send("Email does not exist, please register");
  //check password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("invalid password");

  //create and return a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res
    .header("auth-token", token)
    .header("Access-Control-Allow-Origin", "https://jwt-api.netlify.app/")
    .cookie("token", token)
    .json({ token });
});

module.exports = router;
