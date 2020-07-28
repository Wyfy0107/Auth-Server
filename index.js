const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRoute = require("./routes/post");
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

app.get("/", (req, res) => {
  res.send("hello");
});

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT))
  .catch((err) => console.log(err));
