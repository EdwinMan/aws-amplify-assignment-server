const mongoose = require("mongoose");
// const ConfigDotenv = require("dotenv");
// ConfigDotenv.config();
// require('dotenv').config({ path: 'ENV_FILENAME' });

const ConnectionString : any = "mongodb+srv://root:root@cluster0.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority";
// process.env.ConnectionString || 
// const ConnectionString = process.env.ConnectionString ||
// 'mongodb+srv://root:root@jobfinder.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority';

const ConfigconnectDB = async () => {
    await mongoose.connect("mongodb+srv://root:root@cluster0.zhg1m.mongodb.net/Blog?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then( () => console.log("Database Connection Established") )
    .catch( (error : any) => console.log("Database Failed, with Error: " + error) );
    
};

module.exports = ConfigconnectDB;