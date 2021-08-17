"use strict";
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./DB/Config");
const app = express();
const cors = require("cors");
const AuthController = require("./Controllers/Auth.Controller.js");
const UserController = require("./Controllers/User.Controller");
const PostController = require("./Controllers/Post.Controller");
const CommentController = require("./Controllers/Comment.Controller");
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json({ extended: false }));
const Port = process.env.PORT || 5000;
// Routing
app.use("/api/v1/auth", AuthController);
app.use("/api/v1/user", UserController);
app.use("/api/v1/post", PostController);
app.use("/api/v1/comment", CommentController);
app.use("*", (req, res) => res.sendStatus(404));
// Start Application
app.listen(Port, () => console.log("Server is UP on PORT: " + Port));
