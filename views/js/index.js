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
                console.log(game);

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
                    $(".games").append(`
                    <tr>
                    <td><img src="${game.image}" width="40%"/></td>
                    <td>${game.name}</td>
                    <td>${game.genre}</td>
                    <td>Free To Play</td>
                    <td>
                    <form action="/games/${game.gameid} onsubmit="return playGame();">
                    <input type="hidden" class="inputGameID" value="${game.gameid}"/>
                    <input type="submit" class="playBTN" value="Play Now!"/>
                    </form>
                    </td>
                    </tr>`);
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
            games.forEach(function(game) {
                if (game.price > 0)
                {
                    $(".games").html(`
                    <tr>
                    <td><img src="${game.image}" width="50%"/></td>
                    <td>${game.name}</td>
                    <td>${game.genre}</td>
                    <td>$${game.price}</td>
                    <td><button></button></td>
                    </tr>`);
                }

                else
                {
                    $(".games").html(`
                    <tr>
                    <td><img src="${game.image}" width="40%"/></td>
                    <td>${game.name}</td>
                    <td>${game.genre}</td>
                    <td>$${game.price}</td>
                    <td>TEST</td>
                    </tr>`);
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

function playGame() {
    var gameID = $(".gameID").val();

    sessionStorage.setItem("SgameID", gameID);

    if (sessionStorage.getItem("SgameID") != undefined || sessionStorage.getItem("SgameID") != null)
    {
        return true;
    }

    else
    {
        return false;
    }
}