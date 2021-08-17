const UserRouter = require("express").Router();
const User = require("../Models/User.Model");
const bcrypt = require("bcrypt");
import express = require('express');

// Delete User
UserRouter.route("/:id").delete( async (req : express.Request, res : express.Response) => {
    try
    {
        const DeletedUser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json(DeletedUser)
    }catch(error){
        res.status(500).json(error)
    }
});

// Update User
UserRouter.route("/:id").put( async (req : express.Request, res : express.Response) => {

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
 
    try
    {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set:req.body})
        res.status(200).json(updatedUser)
    }catch(error){
        res.status(500).json(error)
    }

});

// Handling other Unkown Requests
UserRouter.route("/*").all((req : express.Request, res : express.Response) => {
    res.status(404).json({message: "forbidden"});
});

module.exports = UserRouter;