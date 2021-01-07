$(document).ready(function() {

    if (sessionStorage.getItem("login") === true)
    {
        $(".navigation").append(`
            <ul>
                <li><a href="/">LOGO</a></li>
                <li><a href="/">Home</a></li>
                <li>Test</li>
                <li><a href="/profile>Profile</a></li>
                <li><a href="/" class="logout">Log Out</a></li>
            </ul>
        `);
    }

    $.ajax({
        url: "/",
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

    $.ajax({
        url: "/login",
        method:"post"
    })

    .done(
        function (response) {

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

    $(".logOut").click(function(){
        sessionStorage.clear();
        window.location.reload();
    });
})