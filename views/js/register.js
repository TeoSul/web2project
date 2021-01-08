$(document).ready(function() {

})

function validateRegister() {
    var password = document.forms["registration"]["password"].value;

    var confirmPassword = document.forms["registration"]["confirmPassword"].value;

    if (password === confirmPassword)
    {
        $ajax({
            url:"/register",
            method:"post"
        })
    
        .done(
            function(response) {
                if (response != undefined || response != null)
                {
                    sessionStorage.setItem("register", true);
                    windows.location.href = '/login';
                }
    
                else
                {
                    $(".rStatusMessageF").append(`
                    A user already exists with that email. Please try again with a different email.
                    `);
                }
            }
        )
    
        .fail(
            function(err) {
                console.log(err.responseText);
            }
        );

        return true;
    }

    else
    {
        alert("The passwords you have entered do not match. Please try again.");

        return false;
    }
}