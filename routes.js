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
                res.status(500).send("Unable to load profile. Please try again later.");
            }

            else
            {
                //Get Game Statistics By UID
                db.getStatsByUID(userid, function (err, stats) {
                    if (err)
                    {
                        res.status(500).send("Unable to load profile. Please try again laterr.");
                    }

                    else
                    {
                        console.log(Object.keys(stats).length);
                        if (Object.keys(stats).length < 1 || stats === null || stats === undefined)
                        {
                            res.status(200).send({"user": user});
                        }

                        else
                        {
                            db.getAllGames(function (err, gamesT) {
                                if (err)
                                {
                                    res.status(500).send("failedToLoad");
                                }

                                else
                                {
                                    res.status(200).send({"user": user, "games": gamesT, "statistics": stats});
                                }
                            });
                        }
                    }
                });
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

    //Delete Account Route
    router.delete('/api/profile/delete/:uid', function (req, res) {
        var userid = req.params.uid;

        var data = req.body;

        //Hashing of Password
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
                //Verified Password
                if (user != null || user != undefined)
                {
                    //Delete User Account
                    db.deleteAccount(userid, function (err, event) {
                        if (err)
                        {
                            res.status(500).send("Unable to delete your account. Please try again later.");
                        }

                        //No Errors
                        else
                        {
                            if (event === null || event === undefined)
                            {
                                res.status(500).send("nolead");
                            }

                            else
                            {
                                //Get Game Statistics By UID
                                db.getStatsByUID(userid, function(err, stats) {
                                    if (err)
                                    {
                                        res.status(500).send("Unable to delete your account. Please try again later.");
                                    }

                                    //No Errors
                                    else
                                    {
                                        //No Stored Game Statistics
                                        if (Object.keys(stats).length < 1 || stats === null || stats === undefined)
                                        {
                                            //Check For Order History
                                            db.checkOH(userid, function (err, orderhistory) {
                                                if (err)
                                                {
                                                    res.status(500).send("failedToLoad");
                                                }
                                
                                                else
                                                {
                                                    //No Order History
                                                    if (Object.keys(orderhistory).length < 1 || orderhistory === null || orderhistory === undefined)
                                                    {
                                                        res.status(200).send("lead");
                                                    }

                                                    //Order History Is Present
                                                    else
                                                    {
                                                        //Delete Order History
                                                        db.deleteOH(userid, function (err, event) {
                                                            if (err)
                                                            {
                                                                res.status(500).send("Unable to delete your account. Please try again later.");
                                                            }

                                                            else
                                                            {
                                                                if (event === null || event === undefined)
                                                                {
                                                                    res.status(500).send("nolead");
                                                                }

                                                                else
                                                                {
                                                                    res.status(200).send("lead");
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }

                                        //Stored Game Statistics Is Present
                                        else
                                        {
                                            //Delete Game Statistics
                                            db.deleteStats(userid, function (err, event) {
                                                if (err)
                                                {
                                                    res.status(500).send("Unable to delete your account. Please try again later.");
                                                }

                                                else
                                                {
                                                    if (event === null || event === undefined)
                                                    {
                                                        res.status(500).send("nolead");
                                                    }

                                                    else
                                                    {
                                                        //Check For Order History
                                                        db.checkOH(userid, function (err, orderhistory) {
                                                            if (err)
                                                            {
                                                                res.status(500).send("failedToLoad");
                                                            }
                                            
                                                            else
                                                            {
                                                                //No Order History
                                                                if (Object.keys(orderhistory).length < 1 || orderhistory === null || orderhistory === undefined)
                                                                {
                                                                    res.status(200).send("lead");
                                                                }

                                                                else
                                                                {
                                                                    //Delete Order History
                                                                    db.deleteOH(userid, function (err, event) {
                                                                        if (err)
                                                                        {
                                                                            res.status(500).send("Unable to delete your account. Please try again later.");
                                                                        }

                                                                        else
                                                                        {
                                                                            if (event === null || event === undefined)
                                                                            {
                                                                                res.status(500).send("nolead");
                                                                            }

                                                                            else
                                                                            {
                                                                                res.status(200).send("lead");
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
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
            if (err)
            {
                res.status(500).send("failedToLoad");
            }

            else
            {
                res.status(200).send(games);
            }
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

        //Retrieve Game Statistics with UID + GID
        db.getStats(uid, gid, function (err, stats) {
            if (err)
            {
                res.status(500).send("Unable to get game statistics. Please contact a developer immediately!");
            }

            else
            {
                if (Object.keys(stats).length < 1)
                {
                    db.addStats(uid, gid, t, function (err, stat) {
                        if (err)
                        {
                            res.status(500).send("Unable to store game statistics. Please contact a developer immediately!");
                        }

                        else
                        {
                            res.status(200).send(data);
                        }
                    });
                }

                else
                {
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

                if (emailCheck === false)
                {
                    db.addUser(data.username, data.name, data.email, 
                        lHash.update(data.password).digest("hex"),
                        function (err, user) {
                            res.status(200).send({"register" : true});
                        });
                }

                else
                {
                    res.status(200).send({});
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

        console.log(data.lPassword);

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
                            res.status(500).send("Unable to execute action. Please try again later.");
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

    //Unban User
    router.put('/api/dashboard/unban/:uid', function (req, res) {
        var userid = req.params.uid;

        var data = req.body;

        var banStatus = data.banned;

        db.getProfile(userid, function (err, user) {
            if (err)
            {
                res.status(500).send("Unable to retrieve user information. Please try again later");
            }

            else
            {
                if (Object.keys(user).length > 0 || user != null || user != undefined)
                {
                    db.updateBanStatus(userid, banStatus, function(err, user) {
                        if (err)
                        {
                            res.status(500).send("Unable to execute action. Please try again later.");
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
                        res.status(500).send("fail");
                    }

                    //Successfully Added Order Transaction
                    else
                    {
                        res.status(200).send("success");
                    }
                });
            }

            //If Expired
            else
            {
                res.status(200).send("Exped");
            }
        }

        //If CardNumber Is Not Valid
        else
        {
            //If Not Expired
            if (!expirationCheck)
            {
                res.status(200).send("wrongCard");
            }

            //If Expired
            else
            {
                res.status(200).send("wrongCardandExped");
            }
        }
    });

    return router;

};

module.exports = routes();