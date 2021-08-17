"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostRouter = require("express").Router();
const Post = require("../Models/Post.Model");
const Comment = require("../Models/Comment.Model");
const mongoose_1 = __importDefault(require("mongoose"));
// Getting all Posts
PostRouter.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find();
        res.status(200).json({ data: posts });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Get a Post by ID
PostRouter.route("/:id").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorId = mongoose_1.default.Types.ObjectId(req.params.id);
        const posts = yield Post.find({ Author: authorId });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Adding New Post
PostRouter.route("/").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = {};
        post.Author = req.body.Author;
        post.AuthorName = req.body.AuthorName;
        post.title = req.body.title;
        post.text = req.body.text;
        post.hidden = req.body.hidden;
        post.comments = [];
        let postModel = new Post(post);
        postModel.save();
        res.status(200).json(postModel);
    }
    catch (error) {
        res.status(200).json(error);
    }
}));
// Adding Comment to a Post
PostRouter.route("/:id").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var id = mongoose_1.default.Types.ObjectId();
        const oldPost = yield Post.findById(req.params.id);
        let tempComments = oldPost.comments;
        const newPost = yield Post.findByIdAndUpdate(req.params.id, { comments: [...tempComments, { _id: id, AuthorID: req.body.authorID, Author: req.body.author, text: req.body.comment }] });
        res.status(200).json({ success: true, data: { _id: id, AuthorID: req.body.authorID, Author: req.body.author, text: req.body.comment } });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
// Edit a Post
PostRouter.route("/:id").put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield Post.findByIdAndUpdate(req.params.id, { text: req.body.text, hidden: req.body.hidden }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Delete a Post
PostRouter.route("/:id").delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DeletedPost = yield Post.findByIdAndDelete(req.params.id);
        const Posts = yield Post.find();
        res.status(200).json({ DeletedPost, Posts });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Delete a Comment
PostRouter.route("/comment/:id").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.body.commentId;
        const postId = req.params.id;
        const post = yield Post.findById(postId);
        let listComments = post.comments || [];
        const index = listComments.findIndex((comment) => comment._id == commentId);
        if (index == -1)
            return res.json({ success: false, message: "Cant find the Comment" });
        listComments.splice(index, 1);
        const newPost = yield Post.findByIdAndUpdate(postId, { comments: listComments });
        res.status(200).json({ success: true, listComments: listComments, index: index });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
PostRouter.route("/*").all((req, res) => {
    res.status(404).json({ message: "forbidden" });
});
module.exports = PostRouter;
