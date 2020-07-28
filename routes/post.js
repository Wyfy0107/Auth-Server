const router = require("express").Router();
const verification = require("./tokenVerification");
const User = require("../model/User");

router.get("/", verification, async (req, res) => {
  const userID = req.user._id;
  try {
    const user = await User.findOne({ _id: userID });
    res.json({ message: `Hello ${user.name}` });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
