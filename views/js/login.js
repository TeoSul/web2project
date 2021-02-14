$(document).ready(function() {
    if (sessionStorage.getItem("register"))
    {
        $(".statusMessage").html(`
        You have successfully created an account! Proceed to login below!
        `);

        sessionStorage.removeItem("register");
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
            if (response !== "zero")
            {
                //If Account Is Banned
                if (response.banned)
                {
                    $(".lStatusMessageF").html(`
                    Your account has been banned. Please contact an administrator for assistance.
                    `);
                }

                //Account Is Not Banned
                else
                {
                    sessionStorage.setItem("userId", response.userid);
                    sessionStorage.setItem("allowTracking", response.allowTracking);

                    if (sessionStorage.getItem("userId") != undefined)
                    {
                        sessionStorage.setItem("login", true);

                        if (sessionStorage.getItem("login"))
                        {
                            //If User Is An Admin
                            if (response.role === "Admin")
                            {
                                sessionStorage.setItem("admin", true);
                            }

                            //User Is Not An Admin
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