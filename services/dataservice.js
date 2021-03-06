const {
    Double
} = require('bson');
const e = require('express');

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var userSchema = {};
var logSchema = {};
var gameSchema = {};
var statSchema = {};
var orderhistorySchema = {};

var userModel;
var logModel;
var gameModel;
var statModel;
var orderhistoryModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var database = {
    connect: function () {
        mongoose.connect('mongodb://localhost:27017/projectDB', function (err) {
            if (err == null) {
                console.log("Connected to Mongo DB");

                //Users
                userSchema = schema({
                    userid: Number,
                    username: String,
                    name: String,
                    email: String,
                    password: String,
                    allowTracking: Boolean,
                    banned: Boolean,
                    role: String

                });

                //Logging
                logSchema = schema({
                    logid: Number,
                    userid: Number,
                    description: String,
                    category: String,
                    timestamp: Date,
                });

                //Games
                gameSchema = schema({
                    gameid: Number,
                    image: String,
                    name: String,
                    genre: String,
                    price: Number
                });

                //Statistics
                statSchema = schema({
                    statid: Number,
                    userid: Number,
                    gameid: Number,
                    time: Number,
                });

                //Order History
                orderhistorySchema = schema({
                    orderid: Number,
                    userid: Number,
                    gameid: Number,
                });

                var connection = mongoose.connection;

                autoIncrement.initialize(connection);

                userSchema.plugin(autoIncrement.plugin, {
                    model: 'userModel',
                    field: 'userid'
                });

                logSchema.plugin(autoIncrement.plugin, {
                    model: 'logModel',
                    field: 'logid'
                });

                gameSchema.plugin(autoIncrement.plugin, {
                    model: 'gameModel',
                    field: 'gameid'
                });

                statSchema.plugin(autoIncrement.plugin, {
                    model: 'statModel', 
                    field: 'statid'
                });

                orderhistorySchema.plugin(autoIncrement.plugin, {
                    model: 'orderhistoryModel',
                    field: 'orderid'
                });

                userModel = connection.model("users", userSchema);
                logModel = connection.model("logs", logSchema);
                gameModel = connection.model("games", gameSchema);
                statModel = connection.model("stats", statSchema);
                orderhistoryModel = connection.model("orderhistories", orderhistorySchema);

            }
            
            else
            {
                console.log("Error connecting to the database.");
            }
        })
    },

    //Register user
    addUser: function (un, n, em, p, callback) {
        var newUser = new userModel({
            username: un,
            name: n,
            email: em,
            password: p,
            allowTracking: true,
            banned: false,
            role: "Member"
        });

        newUser.save(callback);
    },

    //Get Log
    getLog: function(callback) {
        logModel.find({}, callback);
    },
    
    //Create Log
    createLog: function (uid, d, c, ts, callback) {
        var newLog = new logModel({
            userid: uid,
            description: d,
            category: c,
            timestamp: ts
        });

        newLog.save(callback);
    },

    //Check for/Retrieve stat documents with UID + GID
    getStats: function (uid, gid, callback) {
        statModel.find({
            userid: uid, gameid: gid
        }, callback);
    },

    //Add stat documents
    addStats: function (uid, gid, t, callback) {
        var newStat = new statModel({
            userid : uid,
            gameid: gid,
            time: t
        });

        newStat.save(callback);
    },

    //Update stat documents
    updateStats: function (uid, gid, t, callback) {
        statModel.findOne({userid: uid, gameid: gid}, function (err, stat) {
            if (err)
            {
                stat.time = -1;
                stat.save(callback);
            }

            else
            {
                stat.time = parseInt(stat.time) + parseInt(t);
                stat.save(callback);
            }
        });
    },

    //Add order history documents
    addOH: function (uid, gid, gp, callback) {
        var newOH = new orderhistoryModel({
            userid: uid,
            gameid: gid,
            gameprice: gp
        });

        newOH.save(callback);
    },

    //Retrieve order history
    checkOH: function (uid, callback) {
        orderhistoryModel.find({
            userid: uid
        }, callback);
    },

    //By email only
    getUserByE: function (rEmail, callback) {
        userModel.find({
            email: rEmail
        }, callback);
    },

    //By username only
    getUserByUN: function (rUsername, callback) {
        userModel.find({
            username: rUsername
        }, callback);
    },

    //By email & password
    getUserByEP: function (lEmail, lPassword, callback) {
        userModel.findOne({
            email: lEmail,
            password: lPassword
        }, callback);
    },

    //By password
    getUserByUIDnPass: function(eUID, ePassword, callback) {
        userModel.findOne({
            userid: eUID,
            password: ePassword
        }, callback);
    },

    //Get all users
    getAllUsers: function (callback) {
        userModel.find({}, callback);
    },

    //Get all games
    getAllGames: function (callback) {
        gameModel.find({}, callback);
    },

    //Search for games
    searchGame: function (gn, callback) {
        gameModel.find({
            name: new RegExp(gn, 'i')
        }, callback);
    },

    //Get profile
    getProfile: function (uid, callback) {
        userModel.findOne({
            userid: uid
        }, callback);
    },

    //Update profile
    updateProfile: function(uid, e, u, n, callback) {
        userModel.updateOne({userid: uid}, {email: e, username: u, name: n}, callback);
    },

    //Update account settings
    updateSettings: function(uid, at, callback) {
        userModel.updateOne({userid: uid}, {allowTracking: at}, callback);
    },

    //Update ban status
    updateBanStatus: function(uid, b, callback) {
        userModel.updateOne({userid : uid}, {banned: b}, callback);
    },

    //Get respective game by GameID
    getGame: function (gid, callback) {
        gameModel.findOne({
            gameid: gid
        }, callback);
    },

    //Delete user
    deleteAccount: function(uid, callback) {
        userModel.deleteOne({
            'userid': uid
        }, callback);
    },

    //Get game statistics with only UID
    getStatsByUID: function (uid, callback) {
        statModel.find({
            userid: uid
        }, callback);
    },

    //Delete game statistics
    deleteStats: function(uid, callback) {
        statModel.deleteMany({
            'userid': uid
        }, callback);
    },

    //Delete order history
    deleteOH: function(uid, callback) {
        orderhistoryModel.deleteMany({
            'userid': uid
        }, callback);
    }
};

//Exports
module.exports = database;