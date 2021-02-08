$(document).ready(function() {

    if (sessionStorage.getItem("login"))
    {
        $(".navigation").html(`
            <ul>
                <li><a href="/">ReAccess</a></li>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        `);

        var uid = sessionStorage.getItem("userId");

        //Get All Games (Logged In)
        $.ajax({
            url: `/api/games/${uid}`,
            method:"get",
        })

        .done(
            function (data) {
                console.log(data);

                data.games.forEach(function(game) {
                    //If Game Is Not Free
                    if (game.price > 0)
                    {
                        //If User Has Not Paid For The Game
                        if (Object.keys(data.OH).length < 1)
                        {
                            $(".games").append(`
                            <tr>
                            <td><img src="${game.image}" width="40%"/></td>
                            <td>${game.name}</td>
                            <td>${game.genre}</td>
                            <td>$${game.price}</td>
                            <td>
                            <form onsubmit="return buyGame();">
                            <input type="submit" id="${game.gameid}" class="buyButton" value="BUY"/>
                            </form>
                            </td>
                            </tr>`);

                            $('.buyButton').click(function(e) {
                                var storeGID = $(e.target).attr('id');
                                
                                sessionStorage.setItem("SgameID", storeGID);
                                sessionStorage.setItem("pgameName", game.name);
                                sessionStorage.setItem("pgameGenre", game.genre);
                                sessionStorage.setItem("pgamePrice", game.price);
                            });
                        }

                        //If User Has Paid For The Game
                        else
                        {
                            $(".games").append(`
                            <tr>
                            <td><img src="${game.image}" width="40%"/></td>
                            <td>${game.name}</td>
                            <td>${game.genre}</td>
                            <td>$${game.price}</td>
                            <td>
                            <form onsubmit="return playGame();">
                            <input type="submit" id="${game.gameid}" class="playBTN" value="Play Now!"/>
                            </form>
                            </td>
                            </tr>`);

                            $('.playBTN').click(function(e) {
                                var storeGID = $(e.target).attr('id');
    
                                sessionStorage.setItem("SgameID", storeGID);
                            });
                        }
                    }

                    //If Game Is Free
                    else
                    {
                        $(".games").append(`
                        <tr>
                        <td><img src="${game.image}" width="40%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>Free To Play</td>
                        <td>
                        <form onsubmit="return playGame();">
                        <input type="submit" id="${game.gameid}" class="playBTN" value="Play Now!"/>
                        </form>
                        </td>
                        </tr>`);

                        $('.playBTN').click(function(e) {
                            var storeGID = $(e.target).attr('id');

                            sessionStorage.setItem("SgameID", storeGID);
                        });
                    }
                })
            }
        )

        .fail(
            function (err) {
                console.log(err.responseText);
            }
        );
    }

    //If No Login Session
    else
    {
        //Get All Games
        $.ajax({
            url: "/api/games",
            method:"get"
        })

        .done(
            function (data) {
                console.log(data);
                data.forEach(function(game) {
                    //If Game Is Not Free
                    if (game.price > 0)
                    {
                        $(".games").append(`
                        <tr>
                        <td><img src="${game.image}" width="40%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>$${game.price}</td>
                        <td>
                        <form onsubmit="return buyGame();">
                        <input type="submit" id="${game.gameid}-${game.name}-${game.genre}-${game.price}" class="buyButton${game.gameid}" value="BUY"/>
                        </form>
                        </td>
                        </tr>`);

                        $(`.buyButton${game.gameid}`).click(function(e) {
                            var data = $(e.target).attr('id');
                            var each = data.split("-");

                            var storeGID = each[0];
                            var storeGN = each[1];

                            alert(data);
                            sessionStorage.setItem("SgameID", storeGID);
                            sessionStorage.setItem("pgameName", storeGN);
                            sessionStorage.setItem("pgameGenre", each[2]);
                            sessionStorage.setItem("pgamePrice", each[3]);
                        });
                    }

                    //If Game Is Free
                    else
                    {
                        $(".games").append(`
                        <tr>
                        <td><img src="${game.image}" width="40%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>Free To Play</td>
                        <td>
                        <form onsubmit="return playGame();">
                        <input type="submit" id="${game.gameid}-${game.name}-${game.genre}" class="playBTN${game.gameid}" value="Play Now!"/>
                        </form>
                        </td>
                        </tr>`);

                        $(`.playBTN${game.gameid}`).click(function(e) {
                            var data = $(e.target).attr('id');
                            var each = data.split("-");
                            var storeGID = each[0];
                            var storeGN = each[1];

                            sessionStorage.setItem("SgameID", storeGID);
                            sessionStorage.setItem("pgameName", storeGN);
                        });
                    }
                })
            }
        )

        .fail(
            function (err) {
                console.log(err.responseText);
            }
        );
        
    }
    return false;
})

//Buy Game
function buyGame() {
    var gameID = sessionStorage.getItem("SgameID");

    if (typeof gameID !== 'undefined')
    {
        console.log("two");
        window.location.href = "/payment";
    }

    else
    {
        console.log("one");
        //DOM STATUS MESSAGE
    }

    return false;
}

//Play Game
function playGame() {
    var gameID = sessionStorage.getItem("SgameID");

    if (typeof gameID !== 'undefined')
    {
        window.open(`/games/${gameID}`, "_blank", "top=0,left=0,width=1920,height=1080");
    }

    else
    {
        //DOM STATUS MESSAGE
    }
}

//Search Games
function search() {

    var search = $("#searchPanel").val();

    $.ajax({
        url: "/api/search",
        type:"post",
        data: {searchName: search}
    })

    .done(
        function (games) {
            console.log(games);

            var firstOut = false;

            games.forEach(function(game) {
                //If Game Is Not Free
                if (game.price > 0)
                {
                    if (!firstOut)
                    {
                        $(".games").html(`
                        <tr>
                        <td><img src="${game.image}" width="50%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>$${game.price}</td>
                        <td><button class="buyButton" value="${game.gameid}">BUY</button></td>
                        </tr>`);

                        firstOut = true;
                    }

                    else
                    {
                        $(".games").append(`
                        <tr>
                        <td><img src="${game.image}" width="50%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>$${game.price}</td>
                        <td><button class="buyButton" value="${game.gameid}">BUY</button></td>
                        </tr>`);
                    }

                    $('.buyButton').click(function(e) {
                        var storeGID = $(e.target).attr('id');

                        sessionStorage.setItem("SgameID", storeGID);
                        sessionStorage.setItem("pgameName", game.name);
                        sessionStorage.setItem("pgameGenre", game.genre);
                        sessionStorage.setItem("pgamePrice", game.price);
                    });
                }

                else
                {
                    if (!firstOut)
                    {
                        $(".games").html(`
                        <tr>
                        <td><img src="${game.image}" width="50%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>Free To Play</td>
                        <td>
                        <form onsubmit="return playGame();">
                        <input type="hidden" class="getGameID" value="${game.gameid}"/>
                        <input type="submit" class="playBTN" value="Play Now!"/>
                        </form>
                        </td>
                        </tr>`);

                        firstOut = true;
                    }

                    else
                    {
                        $(".games").append(`
                        <tr>
                        <td><img src="${game.image}" width="50%"/></td>
                        <td>${game.name}</td>
                        <td>${game.genre}</td>
                        <td>Free To Play</td>
                        <td>
                        <form onsubmit="return playGame();">
                        <input type="hidden" class="getGameID" value="${game.gameid}"/>
                        <input type="submit" class="playBTN" value="Play Now!"/>
                        </form>
                        </td>
                        </tr>`);
                    }

                    $('.playBTN').click(function(e) {
                        var storeGID = $(e.target).attr('id');

                        sessionStorage.setItem("SgameID", storeGID);
                    });
                }
            })
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );
    
    return false;
}