const PostRouter = require("express").Router();
const Post = require("../Models/Post.Model");
const Comment = require("../Models/Comment.Model");
import express = require('express');
import mongoose from "mongoose";


interface PostInterface {
    _id?: mongoose.Schema.Types.ObjectId;
    Author?: mongoose.Schema.Types.ObjectId;
    AuthorName?: string;
    text?: string;
    title?: string;
    hidden?: boolean;
    comments?: [];
  }

  interface CommentInterface {
    _id?: string;
    AuthorID?: mongoose.Schema.Types.ObjectId;
    Author?: string;
    text?: string;
  }
  

// Getting all Posts
  PostRouter.route("/").get( async (req : express.Request, res : express.Response) => {
    try
    {
        const posts = await Post.find();
        res.status(200).json({data: posts})
    }catch(error){
        res.status(500).json(error)
    }
});

// Get a Post by ID
PostRouter.route("/:id").get( async (req : express.Request, res : express.Response) => {
    try
    {
        const authorId = mongoose.Types.ObjectId(req.params.id);
        const posts = await Post.find({ Author: authorId});
        res.status(200).json(posts)
    }catch(error){
        res.status(500).json(error)
    }
});

// Adding New Post
PostRouter.route("/").post( async (req : express.Request, res : express.Response) => {
    try{
        let post : PostInterface = {};
        post.Author = req.body.Author;
        post.AuthorName = req.body.AuthorName;
        post.title = req.body.title;
        post.text = req.body.text;
        post.hidden = req.body.hidden;
        post.comments = [];

        let postModel = new Post(post);
        postModel.save();

        res.status(200).json(postModel)
    }
    catch(error){
        res.status(200).json(error)
    }
});

// Adding Comment to a Post
PostRouter.route("/:id").post( async (req : express.Request, res : express.Response) => {
    try{
        var id = mongoose.Types.ObjectId();
        const oldPost = await Post.findById(req.params.id);
        let tempComments = oldPost.comments
        const newPost = await Post.findByIdAndUpdate(
            req.params.id,
            { comments: [...tempComments, {_id: id, AuthorID: req.body.authorID, Author: req.body.author, text: req.body.comment}] }
        );
        res.status(200).json({success: true, data: {_id: id, AuthorID: req.body.authorID, Author: req.body.author, text: req.body.comment}})
    }
    catch(error){
        res.status(400).json(error)
    }
});

// Edit a Post
PostRouter.route("/:id").put( async (req : express.Request, res : express.Response) => {
    try
    {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {text: req.body.text, hidden: req.body.hidden}, {new: true})
        res.status(200).json(updatedPost)
    }catch(error){
        res.status(500).json(error)
    }

});

// Delete a Post
PostRouter.route("/:id").delete( async (req : express.Request, res : express.Response) => {
    try
    {
        const DeletedPost = await Post.findByIdAndDelete(req.params.id);
        const Posts = await Post.find();
        res.status(200).json({DeletedPost, Posts})
    }catch(error){
        res.status(500).json(error)
    }
});

// Delete a Comment
PostRouter.route("/comment/:id").post( async (req : express.Request, res : express.Response) => {
    try
    {
        const commentId : string = req.body.commentId;
        const postId : string = req.params.id;
        const post : PostInterface = await Post.findById(postId);
        
        let listComments = post.comments || [];
        
        const index = listComments.findIndex( (comment : CommentInterface) => comment._id == commentId);
        
        if(index == -1)
         return res.json({success: false, message: "Cant find the Comment"})

        listComments.splice(index, 1);

        const newPost = await Post.findByIdAndUpdate(
            postId,
            { comments: listComments }
        );

        res.status(200).json({success: true, listComments: listComments, index:index})
    }catch(error){
        res.status(500).json(error)
    }
});

PostRouter.route("/*").all((req : express.Request, res : express.Response) => {
    res.status(404).json({message: "forbidden"});
});

module.exports = PostRouter;