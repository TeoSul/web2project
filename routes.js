var bodyParser = require('body-parser');
const e = require('express');

const crypto = require('crypto');

const Card = require('creditcards/card');

var visa = require('creditcards-types/types/visa');
var mastercard = require('creditcards-types/types/mastercard');
var americanExpress = require('creditcards-types/types/american-express');

const expiration = require('creditcards/expiration');

var db = require('./services/dataservice.js');
const { Console } = require('console');

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

    //Logout
    router.get('/logout', function(req, res) {
        res.sendFile(__dirname + "/views/logout.html");
    });

    //Delete Page
    router.get('/delete', function(req, res) {
        res.sendFile(__dirname + "/views/delete.html");
    });

    //CSS
    router.get('/css/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //JavaScript Files
    router.get('/js/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //Images
    router.get('/images/*', function(req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    //Profile Page
    router.get('/profile', function(req ,res) {
        res.sendFile(__dirname + "/views/profile.html");
    })

    //Get User Profile
    router.get('/api/profile/:uid', function(req, res){
        var userid = req.params.uid;

        db.getProfile(userid, function (err, user) {
            if (err)
            {
                res.status(401).send("Unable to get profile with userid.");
                res.status(500).send("Unable to load profile. Please try again later");
                
            }

            else
            {
                res.status(200).send(user);
            }
        });
    })

    //Edit User Profile
    router.put('/api/profile/:uid', function(req, res){
        var userid = req.params.uid;

        var data = req.body;

        var email = data.email;
        var username = data.username;
        var name = data.name;

        //Hashing of Password
        const lHash = crypto.createHash("sha512");
        var password = lHash.update(data.password).digest("hex");

        //Check If Password Is Correct
        db.getUserByUIDnPass(userid, password, function (err, user) {
            if (err)
            {
                res.status(500).send("Unable to update profile. Please try again later.");
            }

            else
            {
                if (user != null || user != undefined)
                {
                    console.log("Edit: " + data);
                    db.updateProfile(userid, email, username, name, function(err, user) {
                        if (err)
                        {
                            res.status(500).send("Unable to update profile. Please try again later.");
                        }

                        else
                        {
                            res.status(200).send(data);
                        }
                    });
                }

                else
                {
                    res.send({});
                }
            }
        })
    });

    //Update Account Settings
    router.put('/api/profile/settings/:uid', function (req, res) {
        var userid = req.params.uid;

        var data = req.body;

        var atBox = data.allowTracking;

        db.updateSettings(userid, atBox, function (err, user) {
            if (err)
            {
                res.status(500).send("Unable to configure account. Please try again later.");
            }

            else
            {
                res.status(200).send(data);
            }
        });
    });

    //Delete Account
    router.delete('/api/profile/delete/:uid', function (req, res) {
        var userid = req.params.uid;

        var data = req.body;

        const lHash = crypto.createHash("sha512");
        var vPassword = lHash.update(data.password).digest("hex");

        //Verify User/Password
        db.getUserByUIDnPass(userid, vPassword, function (err, user) {
            if (err)
            {
                res.status(500).send("Unable to delete your account. Please try again later.");
            }

            else
            {
                //Verified
                if (user != null || user != undefined)
                {
                    db.deleteAccount(userid, function (err, event) {
                        if (err)
                        {
                            res.status(500).send("Unable to delete your account. Please try again later.");
                        }

                        else
                        {
                            if (event == null || event == undefined)
                            {
                                res.status(200).send("nolead");
                            }

                            else
                            {
                                res.status(200).send("lead");
                            }
                        }
                    });
                }

                //Invalid Password
                else
                {
                    res.status(200).send("whatlead");
                }
            }
        });
    });

    //Get All Games
    router.get('/api/games', function(req, res) {
        db.getAllGames(function (err, games) {
            
            res.status(200).send(games);
        });
    });

    //Get All Games (Logged In)
    router.get('/api/games/:uid', function(req, res) {
        var userid = req.params.uid;

        db.getAllGames(function (err, games) {
            if (err)
            {
                res.status(500).send("failedToLoad");
            }

            else
            {
                db.checkOH(userid, function (err, orderhistory) {
                    if (err)
                    {
                        res.status(500).send("failedToLoad");
                    }
    
                    else
                    {
                        console.log(orderhistory);
                        res.status(200).send({"games": games, "OH": orderhistory});
                    }
                });
            }
        });
    });

    //Store Game Statistics
    router.post('/api/games/store', function(req, res) {
        var data = req.body;

        var uid = data.userid;
        var gid = data.gameid;
        var t = data.time;

        db.getStats(uid, gid, function (err, stats) {
            if (err)
            {
                res.status(500).send("Unable to get game statistics. Please contact a developer immediately!");
            }

            else
            {
                console.log(stats);

                if (Object.keys(stats).length < 1)
                {
                    console.log("wrap");

                    db.addStats(uid, gid, t, function (err, stat) {
                        if (err)
                        {
                            console.log("BLOOP");

                            res.status(500).send("Unable to store game statistics. Please contact a developer immediately!");
                        }

                        else
                        {
                            console.log("KAI");
                            res.status(200).send(data);
                        }
                    });
                }

                else
                {
                    console.log("rap");

                    db.updateStats(uid, gid, t, function (err, stat) {
                        if (err)
                        {
                            res.status(500).send("Unable to update game statistics. Please contact a developer immediately!");
                        }

                        else
                        {
                            res.status(200).send(data);
                        }
                    });
                }
            }
        });
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

        const lHash = crypto.createHash("sha512");

        db.getUserByE(email, function(err, user) {  
            console.log(user);
            if (err)
            {
                res.status(500).send("Unable to register. Please try again later.");
            }

            else
            {
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
                    db.addUser(data.username, data.name, data.email, 
                        lHash.update(data.password).digest("hex"),
                        function (err, user) {
                            res.send({"register" : true});
                        });
                }

                else
                {
                    res.send({});
                }
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

        const lHash = crypto.createHash("sha512");
        var password = lHash.update(data.lPassword).digest("hex");

        var userCheck;

        db.getUserByEP(email, password, function (err, user) {

            if (err)
            {
                res.status(500).send("Unable to login. Please try again later");
            }

            else
            {
                if (user === undefined || user === null)
                {
                    userCheck = false;
                }

                else
                {
                    userCheck = true;
                }
                
                console.log("User Check: " + userCheck);

                if (userCheck)
                {
                    res.status(200).send(user);
                }

                else
                {
                    res.status(200).send("zero");
                }
            }
        });
    });

    //Send Search Input from User (Logged In)
    router.post('/api/search/:uid', function (req, res) {
        var userid = req.params.uid;
        var name = req.body.searchName;

        db.searchGame(name, function(err, games) {
            if (err)
            {
                res.status(500).send("Unable to search for games. Please try again later");
            }

            else
            {
                //Empty Search String
                if (name === "" || name === null || name === undefined)
                {
                    db.getAllGames(function (err, games) {
                        if (err)
                        {
                            res.status(500).send("failedToLoad");
                        }
            
                        else
                        {
                            db.checkOH(userid, function (err, orderhistory) {
                                if (err)
                                {
                                    res.status(500).send("failedToLoad");
                                }
                
                                else
                                {
                                    console.log(orderhistory);
                                    res.status(200).send({"games": games, "OH": orderhistory});
                                }
                            });
                        }
                    });
                }

                //Got Search Input From User
                else
                {
                    db.checkOH(userid, function (err, orderhistory) {
                        if (err)
                        {
                            res.status(500).send("failedToLoad");
                        }
        
                        else
                        {
                            console.log(orderhistory);
                            res.status(200).send({"games": games, "OH": orderhistory});
                        }
                    });
                }
            }
        });
    });

    //Send Search Input from User
    router.post('/api/search', function (req, res) {
        var name = req.body.searchName;

        db.searchGame(name, function(err, games) {
            if (err)
            {
                res.status(500).send("Unable to search for games. Please try again later");
            }

            else
            {
                if (name === "" || name === null || name === undefined)
                {
                    db.getAllGames(function (err, games) {
                        res.status(200).send(games);
                    });
                }

                else
                {
                    res.status(200).send(games);
                }
            }
        });
    });

    //Dashboard Page
    router.get('/dashboard', function (req, res) {
        res.sendFile(__dirname + "/views/dashboard.html");
    });

    //Display Users on Dashboard
    router.get('/api/dashboard/users', function (req, res) {
        db.getAllUsers(function (err, users) {
            res.send(users);
        });
    });

    //Ban User
    router.put('/api/dashboard/ban/:uid', function (req, res) {
        var userid = req.params.uid;

        var data = req.body;

        var banStatus = data.banned;

        db.getProfile(userid, function (err, user) {
            if (err)
            {
                res.status(500).send("Unable to load profile. Please try again later");
            }

            else
            {
                if (Object.keys(user).length > 0 || user != null || user != undefined)
                {
                    db.updateBanStatus(userid, banStatus, function(err, user) {
                        if (err)
                        {
                            res.send(500).send("Unable to execute action. Please try again later.");
                        }
            
                        else
                        {
                            res.status(200).send(data);
                        }
                    });
                }

                else
                {
                    res.send(500).send("Unable to execute action. Please try again later.");
                }
            }
        });
    });

    //Open A New Window (Game)
    router.get('/games/:gid', function(req, res) {
        res.sendFile(__dirname + "/views/playing.html");
    });

    //Get Respective Game
    router.get('/api/respectiveGames/:gid', function (req, res) {
        var gameid = req.params.gid;

        db.getGame(gameid, function (err, game) {
            if (err)
            {
                res.status(500).send("Unable to load game. Please try again later");
            }

            else
            {
                if (game != undefined || game != null)
                {
                    res.status(200).send(game);
                }

                else
                {
                    res.status(500).send("Unable to load game. Please try again later.");
                }
            }
        });
    });

    //Payment Page
    router.get('/payment', function (req, res) {
        res.sendFile(__dirname + "/views/payment.html");
    });

    //Checkout
    router.post('/api/payment/checkout', function (req, res) {
        var data = req.body;

        //User + Product Information
        var suid = data.uid;

        console.log("User ID: " + suid);

        var sgid = data.gid;
        var sgameprice = data.price;

        //Card Information
        var cardNum = data.cardNo;
        var smonth = data.month;
        var syear = data.year;

        const card = Card([visa, mastercard, americanExpress]);
        const cardCheck =  card.isValid(card.parse(cardNum));

        //Check For Expiration
        const expirationCheck = expiration.isPast(smonth, syear);

        //If CardNumber Is Valid
        if (cardCheck)
        {
            //If Not Expired
            if (!expirationCheck)
            {
                db.addOH(suid, sgid, sgameprice, function (err, orderHistory) {
                    //Error
                    if (err)
                    {
                        res.status(500).send("Unsuccessfully Added Order Transaction");
                    }

                    //Successfully Added Order Transaction
                    else
                    {
                        res.status(200).send("Successfully Added Order Transaction");
                    }
                });
            }

            //If Expired
            else
            {
                res.status(200).send("Expired Card");
            }
        }

        //If CardNumber Is Not Valid
        else
        {
            //If Not Expired
            if (!expirationCheck)
            {
                res.status(200).send("Wrong Card Number");
            }

            //If Expired
            else
            {
                res.status(200).send("Wrong Card Number and Expired");
            }
        }
    });

    return router;

};

module.exports = routes();