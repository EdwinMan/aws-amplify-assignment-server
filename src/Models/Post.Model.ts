const PostMongoose = require('mongoose');
import mongoose from "mongoose";

const post = new PostMongoose.Schema({
        Author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        AuthorName:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        text:{
            type: String,
            required: true
        },
        hidden:{
            type: Boolean,
            required: false,
            default: false,
        },
        comments: []
        // comments: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'comment'
        //   }]
    },
    {timestamps: true});

let PostModel = PostMongoose.model('post', post);

module.exports = PostModel;