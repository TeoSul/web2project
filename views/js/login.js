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
        // window.location.href('/');
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
            console.log(response.userid);

            if (response.userid != undefined)
            {
                sessionStorage.setItem("userId", response.userid);

                console.log("User ID: " + sessionStorage.getItem("userId"));

                if (sessionStorage.getItem("userId") != undefined)
                {
                    sessionStorage.setItem("login", true);

                    console.log(sessionStorage.getItem("login"));

                    if (sessionStorage.getItem("login"))
                    {
                        window.location.href = "/";
                    }

                    else
                    {
                        $(".statusMessage").append(`
                        An error has occurred. Please try again later.
                        `);
                    }
                }

                else
                {
                    $(".statusMessage").append(`
                    An error has occurred. Please try again later.
                    `);
                }
            }

            else
            {
                $(".statusMessage").append(`
                You have entered an invalid username or password. Please try again.
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