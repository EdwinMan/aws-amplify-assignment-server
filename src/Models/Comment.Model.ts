const CommentMongoose = require('mongoose');
import mongoose from "mongoose";
const SchemaComment = mongoose.Schema;

const comment = new CommentMongoose.Schema({
        Author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        postID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        },
        text:{
            type: String,
            required: true
        },
    },
    {timestamps: true});

let CommentModel = CommentMongoose.model('comment', comment);

module.exports = CommentModel;