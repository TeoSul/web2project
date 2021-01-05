var bodyParser = require('body-parser');
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

        var emailCheck = db.getUser(email, function(err, user) {
            res.send(user);
        });

        console.log(emailCheck);
        
        if (emailCheck === undefined || emailCheck === null)
        {
            db.addUser(data.username, data.name, data.email, data.password,
                function (err, user) {
                    res.redirect('../login');
                });
        }

        else
        {
            res.redirect('back');
            $("#emailExist").append(`An account with the email already exists.`);
        }
    });

    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });

    router.post('/login', function (req, res) {
        
    })

    return router;

};

module.exports = routes();