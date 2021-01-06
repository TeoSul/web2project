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
        url: "/login",
        method:"post"
    })

    .done(
        function (response) {

            console.log(response);

            if (response.userid != null || response.userid != undefined)
            {
                sessionStorage.setItem("userId", response.userid);

                if (sessionStorage.getItem("userId") != null || sessionStorage.getItem("userId") != undefined)
                {
                    sessionStorage.setItem("login", true);

                    if (sessionStorage.getItem("login") === true)
                    {
                        window.location.href = '/';
                    }

                    else
                    {
                        window.location.reload();
                    }
                }

                else
                {
                    window.location.reload();
                }
            }

            else
            {
                window.location.reload();
            }
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );

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
                <td>
                </tr>`)
            })
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    )
})