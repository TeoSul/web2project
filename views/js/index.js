$(document).ready(function() {

    if (sessionStorage.getItem("login"))
    {
        $(".navigation").html(`
            <ul>
                <li><a href="/">LOGO</a></li>
                <li><a href="/">Home</a></li>
                <li>Test</li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/logout">Log Out</a></li>
            </ul>
        `);
    }

    //Get All Games
    $.ajax({
        url: "/api/games",
        method:"get"
    })

    .done(
        function (data) {
            console.log(data);
            data.forEach(function(game) {
                if (game.price > 0)
                {
                    $(".games").append(`
                    <tr>
                    <td><img src="${game.image}" width="40%"/></td>
                    <td>${game.name}</td>
                    <td>${game.genre}</td>
                    <td>$${game.price}</td>
                    <td><button class="buyButton" value="${game.gameid}">BUY</button></td>
                    </tr>`);
                }

                else
                {
                    console.log("YO: " + game.gameid);

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
})

//Play Game
function playGame() {
    var gameID = sessionStorage.getItem("SgameID");

    console.log("TUK: " + gameID);

    if (typeof gameID !== 'undefined')
    {
        window.location.href = `/games/${gameID}`;
    }

    else
    {
        alert("Hello");
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