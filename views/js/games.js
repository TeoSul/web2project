$(document).ready(function() {

    if (sessionStorage.getItem("login") === true)
    {
        $(".navigation").append(`
            <ul>
                <li>Home</li>
                <li>Test</li>
                <li>Profile</li>
                <li>Log Out</li>
            </ul>
        `);
    }

    $.ajax({
        url: "/games",
        method:"get"
    })

    .done(
        function (data) {
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