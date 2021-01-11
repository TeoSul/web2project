const {
    Double
} = require('bson');
const e = require('express');

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var userSchema = {};
var gameSchema = {};
var statSchema = {};

var userModel;
var gameModel;
var statModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var database = {
    connect: function () {
        mongoose.connect('mongodb://localhost:27017/projectDB', function (err) {
            if (err == null) {
                console.log("Connected to Mongo DB");

                //Initialize values
                userSchema = schema({
                    userid: Number,
                    username: String,
                    name: String,
                    email: String,
                    password: String,
                    allowTracking: Boolean,
                    banned: Boolean

                });

                gameSchema = schema({
                    gameid: Number,
                    image: String,
                    name: String,
                    genre: String,
                    price: Number
                });

                statSchema = schema({
                    userid: Number,
                    gameid: Number,
                    time: Number,
                });

                var connection = mongoose.connection;

                autoIncrement.initialize(connection);

                userSchema.plugin(autoIncrement.plugin, {
                    model: 'userModel',
                    field: 'userid'
                });

                gameSchema.plugin(autoIncrement.plugin, {
                    model: 'gameModel',
                    field: 'gameid'
                });

                userModel = connection.model("users", userSchema);
                gameModel = connection.model("games", gameSchema);
                statModel = connection.model("stats", statSchema);

            } else {
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
            banned: false
        });

        newUser.save(callback);
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

    //By email only
    getUserByE: function (rEmail, callback) {
        userModel.find({
            email: rEmail
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
    updateProfile: function(e, u, n, callback) {
        userModel.updateMany({email: e}, {username: u}, {name: n}, callback);
    }
};

//Exports
module.exports = database;