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
                $(".games").append(`
                <tr>
                <td><img src="${game.image}" width="60%"/></td>
                <td>${game.name}</td>
                <td>${game.genre}</td>
                <td>$${game.price}</td>
                <td>TEST</td>
                </tr>`);
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
                $(".games").html(`
                <tr>
                <td><img src="${game.image}" width="60%"/></td>
                <td>${game.name}</td>
                <td>${game.genre}</td>
                <td>$${game.price}</td>
                <td>TEST</td>
                </tr>`);
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