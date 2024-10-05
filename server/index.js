const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const UserModel = require("./models/User");
const PostModel = require("./models/Post");
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect("mongodb://localhost:27017/Blog")
  .then(() => console.log("Mongo connected!"));

const JWT_SECRET = "Natu123!";

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new UserModel({ username, password: hashedPassword });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      res.status(404).json({ message: "User not found!" });
    }

    const comPassword = await bcrypt.compare(password, userDoc.password);

    if (!comPassword) {
      res.status(404).json({ message: "Password not found!" });
    }
    const token = jwt.sign({ username, id: userDoc.id }, JWT_SECRET);
    console.log("Token Created!");
    res.status(200).cookie("token", token).json({
      id: userDoc._id,
      username,
    });
  } catch (error) {
    console.log(error);
    res.status(400);
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  const info = jwt.verify(token, JWT_SECRET);
  res.status(200).json(info);
  // res.status(494).json('User not logged In')
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, path + "." + ext);
  const { title, summary, content } = req.body;
  const { token } = req.cookies;
  if (token) {
    const info = jwt.verify(token, JWT_SECRET);
    const post = new PostModel({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    await post.save();
    res.json(post);
  }
});

app.get("/post", async (req, res) => {
  const posts = await PostModel.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate("author", ["username"]);
  res.json({ postDoc });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, path + "." + ext);
  }

  const { token } = req.cookies;
  const {id, title, summary, content} = req.body

  if (token) {
    const info = jwt.verify(token, JWT_SECRET);
    const postDoc = await PostModel.findById(id)
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)
    if(!isAuthor) {
      return res.status(400).json('You are not the author!')
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover
    })
  }

  res.json("Updated")
});

app.listen(4000);
// mongodb://localhost:27017/Blog
