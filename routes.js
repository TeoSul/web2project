var bodyParser = require('body-parser');
const e = require('express');
var db = require('./services/dataservice.js');

db.connect();

var routes = function () {
    var router = require('express').Router();

    router.use(bodyParser.urlencoded({
        extended: true
    }));

    //Homepage
    router.get('/', function (req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });

    //CSS
    router.get('/css/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //JavaScript Files
    router.get('/js/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //Get all games
    router.get('/games', function(req, res) {
        db.getAllGames(function (err, games) {
            res.send(games);
        })
    })

    //Registration Page
    router.get('/register', function(req,res) {
        res.sendFile(__dirname + "/views/register.html");
    });

    //Send Registration Input from User
    router.post('/register', function (req, res) {
        var data = req.body;
    
        var email = data.email;

        var emailCheck;

        db.getUserByE(email, function(err, user) {  
            console.log(user);   
            if (Object.keys(user).length < 1 || user === null || user === undefined)
            {
                emailCheck = false;
            }

            else
            {
                emailCheck = true;
            }

            console.log("Email Check: " + emailCheck);

            if (emailCheck === false || emailCheck === undefined || emailCheck === null)
            {
                db.addUser(data.username, data.name, data.email, data.password,
                    function (err, user) {
                        console.log("Registered User: " + user);
                        res.send({"userid" : user.userid});
                    });
            }

            else
            {
                res.redirect('../register/invalidEmail');
            }
        });
    });

    //Login Page
    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });

    //Send Login Input from User
    router.post('/login', function (req, res) {
        var data = req.body;

        var email = data.lEmail;
        var password = data.lPassword;

        var userCheck;

        db.getUserByEP(email, password, function (err, user) {
            
            console.log(user);
            if (user === null || user === undefined)
            {
                userCheck = false;
            }

            else
            {
                userCheck = true;
            }
            
            console.log("User Check: " + userCheck);

            if (userCheck === true)
            {
                res.send({"userid": user.userid});
            }

            else
            {
                res.redirect('/login/invalid');
            }
        });
    })

    return router;

};

module.exports = routes();