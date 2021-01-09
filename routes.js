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

    router.get('/logout', function(req, res) {
        res.sendFile(__dirname + "/views/logout.html");
    });

    //CSS
    router.get('/css/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //JavaScript Files
    router.get('/js/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    router.get('/api/games', function(req, res) {
        db.getAllGames(function (err, games) {
            res.send(games);
        })
    });

    //Registration Page
    router.get('/register', function(req,res) {
        res.sendFile(__dirname + "/views/register.html");
    });

    //Send Registration Input from User
    router.post('/api/register', function (req, res) {
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
                        res.send({"register" : true});
                    });
            }

            else
            {
                res.send({});
            }
        });
    });

    //Login Page
    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });

    //Send Login Input from User
    router.post('/api/login', function (req, res) {
        var data = req.body;

        var email = data.lEmail;
        var password = data.lPassword;

        var userCheck;

        db.getUserByEP(email, password, function (err, user) {
            
            if (Object.keys(user).length < 1 || user === undefined || user === null)
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
                console.log(user.userid);
                res.json({"login" : true,
                    "userid": user.userid});
            }

            else
            {
                res.json({"login": false});
            }
        });
    });

    //Send Search Input from User
    router.post('/api/search', function (req, res) {
        var data = req.body;
        
        var searchInput = data.searchPanel;
    });



    return router;

};

module.exports = routes();