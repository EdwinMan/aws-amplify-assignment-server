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
Object.defineProperty(exports, "__esModule", { value: true });
const CommentRouter = require("express").Router();
const Comment = require("../Models/Comment.Model");
CommentRouter.route("/").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let comment = {};
        comment.Author = req.body.Author;
        comment.postID = req.body.postID;
        comment.text = req.body.text;
        let commentModel = new Comment(comment);
        commentModel.save();
        res.status(200).json(commentModel);
    }
    catch (error) {
        res.status(200).json(error);
    }
}));
CommentRouter.route("/*").all((req, res) => {
    res.status(404).json({ message: "forbidden" });
});
module.exports = CommentRouter;
