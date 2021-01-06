const { Double } = require('bson');
const e = require('express');

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var userSchema = {};

var gameSchema = {};

var userModel;

var gameModel;

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
                    password: String
                });

                gameSchema = schema({
                    gameid: Number,
                    name: String,
                    genre: String,
                    price: Number
                });

                var connection = mongoose.connection;

                autoIncrement.initialize(connection);

                userSchema.plugin(autoIncrement.plugin, {model:'userModel', field:'userid'});
                gameSchema.plugin(autoIncrement.plugin, {model:'gameModel', field:'gameid'});

                userModel = connection.model("users", userSchema);
                gameModel = connection.model("games", gameSchema);

                
            }

            else {
                console.log("Error connecting to the database.");
            }
        })
    },

    addUser : function (un, n, em, p, callback) {
        var newUser = new userModel({
            username: un,
            name: n,
            email: em,
            password: p
        });

        newUser.save(callback);
    },

    //By email only
    getUserByE : function(rEmail, callback) {
        userModel.find({email: rEmail}, callback);
    },

    //By email & password
    getUserByEP : function(lEmail, lPassword, callback) {
        userModel.find({email: lEmail, password: lPassword}, callback);
    }
};

//Exports
module.exports = database;