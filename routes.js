var bodyParser = require('body-parser');
const e = require('express');
var db = require('./services/dataservice.js');

db.connect();

var routes = function () {
    var router = require('express').Router();

    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.get('/', function (req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });

    router.get('/css/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    router.get('/js/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    router.get('/register', function(req,res) {
        res.sendFile(__dirname + "/views/register.html");
    });

    router.post('/register', function (req, res) {
        var data = req.body;
    
        var email = data.email;

        var emailCheck;

        db.getUserByE(email, function(err, user) {     
            if (user === null || user === undefined)
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
                        res.redirect('../login');
                    });
            }

            else
            {
                res.redirect('../register/invalidEmail');
            }
        });
    });

    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });

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
                var sessionStorage;

                var userId;

                db.getUserByE(email, function(err, user) {
                    if (user === null || user === undefined)
                    {
                        res.redirect('/login/invalid');
                    }

                    else
                    {
                        res.send({"userid": user.userid});
                        console.log(res);
                    }
                })
            }
        });
    })

    return router;

};

module.exports = routes();