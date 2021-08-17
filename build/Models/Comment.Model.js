"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommentMongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const SchemaComment = mongoose_1.default.Schema;
const comment = new CommentMongoose.Schema({
    Author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    postID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'post'
    },
    text: {
        type: String,
        required: true
    },
}, { timestamps: true });
let CommentModel = CommentMongoose.model('comment', comment);
module.exports = CommentModel;
