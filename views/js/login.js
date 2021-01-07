const database = require("../../services/dataservice");

$(document).ready(function() {
    if (sessionStorage.getItem("login") === true)
    {
        alert("You are already logged in!");
        window.location.href('/');
    }

    $ajax({
        url:"/register",
        method:"post"
    })

    .done(
        function(response) {
            if (response != null || response != undefined)
            {
                $(".statusMessage").append(`
                You have successfully created an account! Proceed to login below!
                `);
            }

            else
            {
                var registerStatus = false;
                sessionStorage.setItem("register", registerStatus);
                windows.location.href = '/register';
            }
        }
    )

    .fail(
        function(err) {
            console.log(err.responseText);
        }
    )
})