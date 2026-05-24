const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

require("dotenv").config();

const Todo = require("./models/Todo");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));



// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});



// GET TODOS
app.get("/todos", auth, async (req, res) => {

  const todos = await Todo.find();

  res.json(todos);

});



// ADD TODO
app.post("/add", async (req, res) => {

  const todo = new Todo({
    text: req.body.text
  });

  await todo.save();

  res.json(todo);

});
app.delete("/delete/:id", async (req, res) => {

  await Todo.findByIdAndDelete(req.params.id);

  res.json({
    message: "Todo Deleted"
  });

});



// REGISTER USER
app.post("/register", async (req, res) => {

  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({
    message: "User Registered Successfully"
  });

});



// LOGIN USER
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User Not Found"
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid Password"
    });
  }

  const token = jwt.sign(
    { id: user._id },
    "secretkey"
  );

  res.json({
    token,
    message: "Login Successful"
  });

});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});