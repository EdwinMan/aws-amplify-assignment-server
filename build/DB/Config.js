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
const mongoose = require("mongoose");
// const ConfigDotenv = require("dotenv");
// ConfigDotenv.config();
// require('dotenv').config({ path: 'ENV_FILENAME' });
const ConnectionString = "mongodb+srv://root:root@cluster0.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority";
// process.env.ConnectionString || 
// const ConnectionString = process.env.ConnectionString ||
// 'mongodb+srv://root:root@jobfinder.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority';
const ConfigconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose.connect("mongodb+srv://root:root@cluster0.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
        .then(() => console.log("Database Connection Established"))
        .catch((error) => console.log("Database Failed, with Error: " + error));
});
module.exports = ConfigconnectDB;
