const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRoute = require("./routes/post");

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to db")
);

app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

app.listen(4000);
