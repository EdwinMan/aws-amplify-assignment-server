"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostMongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const post = new PostMongoose.Schema({
    Author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    AuthorName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    hidden: {
        type: Boolean,
        required: false,
        default: false,
    },
    comments: []
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'comment'
    //   }]
}, { timestamps: true });
let PostModel = PostMongoose.model('post', post);
module.exports = PostModel;
