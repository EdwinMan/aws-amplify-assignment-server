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
const UserRouter = require("express").Router();
const User = require("../Models/User.Model");
const bcrypt = require("bcrypt");
// Delete User
UserRouter.route("/:id").delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DeletedUser = yield User.findByIdAndDelete(req.params.id);
        res.status(200).json(DeletedUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Update User
UserRouter.route("/:id").put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password) {
        const salt = yield bcrypt.genSalt(10);
        req.body.password = yield bcrypt.hash(req.body.password, salt);
    }
    try {
        const updatedUser = yield User.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
// Handling other Unkown Requests
UserRouter.route("/*").all((req, res) => {
    res.status(404).json({ message: "forbidden" });
});
module.exports = UserRouter;
