$(document).ready(function() {
    if (sessionStorage.getItem("register"))
    {
        $(".statusMessage").html(`
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
            if (response != "zero")
            {
                if (response.banned)
                {
                    $(".lStatusMessageF").html(`
                    Your account has been banned. Please contact an administrator for assistance.
                    `);
                }

                else
                {
                    sessionStorage.setItem("userId", response.userid);
                    sessionStorage.setItem("allowTracking", response.allowTracking);

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
                            $(".lStatusMessageF").html(`
                            An error has occurred. Please try again later.
                            `);
                        }
                    }

                    else
                    {
                        $(".lStatusMessageF").html(`
                        An error has occurred. Please try again later.
                        `);
                    }
                }
            }

            else
            {
                $(".lStatusMessageF").html(`
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