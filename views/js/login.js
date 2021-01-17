$(document).ready(function() {
    if (sessionStorage.getItem("register"))
    {
        $(".statusMessage").append(`
        You have successfully created an account! Proceed to login below!
        `);
    }

    if (sessionStorage.getItem("login"))
    {
        alert("You are already logged in!");
        window.location.href('/');
    }
})

function login() {

    var login = {
        lEmail : $("#lEmail").val(),
        lPassword: $("#lPassword").val()
    }

    $.ajax({
        url: "/api/login",
        type:"post",
        data: login
    })

    .done(
        function (response) {
            if (response.login)
            {
                sessionStorage.setItem("userId", response.userid);
                sessionStorage.setItem("allowTracking", true);

                console.log("User ID: " + sessionStorage.getItem("userId"));

                if (sessionStorage.getItem("userId") != undefined)
                {
                    sessionStorage.setItem("login", true);

                    if (sessionStorage.getItem("login"))
                    {
                        if (response.admin)

                        {
                            sessionStorage.setItem("admin", true);
                        }

                        else
                        {
                            sessionStorage.setItem("admin", false);
                        }

                        window.location.href = "/";
                    }

                    else
                    {
                        $(".lStatusMessageF").append(`
                        An error has occurred. Please try again later.
                        `);
                    }
                }

                else
                {
                    $(".lStatusMessageF").append(`
                    An error has occurred. Please try again later.
                    `);
                }
            }

            else
            {
                $(".lStatusMessageF").append(`
                You have entered an invalid email or password. Please try again.
                `);
            }
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );

    return false;
}