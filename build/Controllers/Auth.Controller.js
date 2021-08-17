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
const router = require("express").Router();
const User = require("../Models/User.Model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// Register New User
router.route("/register").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the User Exists
        const userFound = yield User.findOne({ email: req.body.email });
        if (userFound != null) { // if the User Exists is out DB
            if (userFound.isVerified) // check if he is Verified, then return:
                return res.json({ Conflict: true, message: "User Already Exists" });
            else // return that the User Exist but his Email still not Verified 
                return res.json({ Conflict: true, message: "User Already Exists, But Email not Activated Yet" });
        }
        const salt = yield bcrypt.genSalt(10); // creating a Salt to decrypt the Password
        const hashedPass = yield bcrypt.hash(req.body.password, salt); // has the Password with the Salt using (bcrypt.hash)
        let user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            emailToken: crypto.randomBytes(64).toString('hex'),
            password: hashedPass,
        };
        let userModel = new User(user);
        // Creting the Transporter to who will Send the Email
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'OIM10006@students.aust.edu.lb',
                pass: 'Whatthefuck123@@'
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // Creating the Message's HTML. and Activation URL.
        let HTML = "<h3>Dear, " + capitalize(user.firstName) + " " + capitalize(user.lastName) + ". </h3></br><h4>Please Click on the Link To Activate Your Account:</h4><h4>http://localhost:5000/api/v1/auth/verify-email?token=" + user.emailToken + "</h4></br><h3>Sincerely</h3><h3>Zero&One</h3>";
        // Set the Receiver Info
        let message = {
            from: 'Zero&One <OIM10006@students.aust.edu.lb>',
            to: user.email,
            subject: 'Account Verification',
            text: "Please Click on the Link below to verify your account.",
            html: HTML,
        };
        // Commit the sending 
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        // Save the suer after successflly sending Meesage 
        userModel.save();
        return res.status(200).json({ success: true, data: userModel });
    }
    catch (error) {
        return res.status(500).json(error);
    }
}));
// Login User
router.route("/login").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Search for the User in the DB
        const user = yield User.findOne({ email: req.body.email });
        if (user == null) // if the user not found return:
            return res.status(200).json({ success: false, message: "Wrong Email" });
        if (!user.isVerified) // if the user found but not email is not verified:
            return res.status(200).json({ success: false, message: "Email Not Verified Yet" });
        // if the email is found and it was good, then check for the passwrod
        const validated = yield bcrypt.compare(req.body.password, user.password);
        if (!validated) // if wrong password:
            return res.status(200).json({ success: false, message: "Wrong Password" });
        // if all is good, return success status with the user info
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ success: false, data: error });
    }
}));
// Forget Password
router.route("/forgetpassword").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ email: req.body.email });
        if (user == null)
            return res.status(404).json({ Found: false, message: "Email does not Exist" });
        // Set up the message sender Info:
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'OIM10006@students.aust.edu.lb',
                pass: 'Whatthefuck123@@'
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        // generating a New Password and store in the DB
        let NewPassword = crypto.randomBytes(5).toString('hex');
        const salt = yield bcrypt.genSalt(10);
        const hashedNewPass = yield bcrypt.hash(NewPassword, salt);
        let newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            emailToken: "",
            password: hashedNewPass,
            isVerified: true,
        };
        yield User.findByIdAndUpdate(user._id, newUser);
        let HTML = "<h1>Your New Password:" + NewPassword + "</h1>";
        // Message object
        let message = {
            from: 'Zero&One <OIM10006@students.aust.edu.lb>',
            to: user.email,
            subject: 'Reset Password',
            text: "Reset Password",
            html: HTML,
        };
        // commit sending the message which contain the new password
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        return res.status(200).json({ PasswordChanged: true, message: "User Password has Changed Successfully" });
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
// Verify Email
router.route("/verify-email").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // try to find the user with the given token
        const user = yield User.findOne({ emailToken: req.query.token });
        if (user == null) // if no one, then token is wrong
            return res.status(406).json({ tokenValid: false, message: "Wrong Token" });
        let newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            emailToken: "",
            password: user.password,
            isVerified: true,
        };
        // activate the User account.
        yield User.findByIdAndUpdate(user._id, newUser);
        // return res.sendFile('../Views/EmailActivated.html');
        return res.status(200).json({ success: true, message: "User Email Successfully Activated" });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
// This is a Support function that makes Each work a Cammel Case 
function capitalize(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}
// Verify Email
router.route("/OMG").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.send('<html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>Account Verified Successfully Please vist the Link to Login:</h1><a href="http://localhost:3000/login"> Zero&One Blog</a></body></html>');
        // return res.status(200).json({success: true, message: "User Email Successfully Activated"})
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
module.exports = router;
