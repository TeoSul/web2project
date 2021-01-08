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

    $.ajax({
        url: "/api/games",
        method:"get"
    })

    .done(
        function (data) {

            console.log(data);
            data.forEach(function(game) {
                $(".games").append(`
                <tr>
                <td>${game.name}</td>
                <td>${game.genre}</td>
                <td>${game.price}</td>
                <td>TEST</td>
                </tr>`)
            })
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );
})