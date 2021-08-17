const CommentRouter = require("express").Router();
const Comment = require("../Models/Comment.Model");
import express = require('express');
import mongoose from "mongoose";

interface CommentInterface {
    Author?: mongoose.Schema.Types.ObjectId;
    postID?: mongoose.Schema.Types.ObjectId;
    text?: string;
  }

  CommentRouter.route("/").post( async (req : express.Request, res : express.Response) => {
    try{
        let comment : CommentInterface = {};
        comment.Author = req.body.Author;
        comment.postID = req.body.postID;
        comment.text = req.body.text;

        let commentModel = new Comment(comment);
        commentModel.save();

        res.status(200).json(commentModel)
    }
    catch(error){
        res.status(200).json(error)
    }
});

CommentRouter.route("/*").all((req : express.Request, res : express.Response) => {
    res.status(404).json({message: "forbidden"});
});

module.exports = CommentRouter;