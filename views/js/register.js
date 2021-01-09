function validateRegister() {
    var password = document.forms["registration"]["password"].value;

    var confirmPassword = document.forms["registration"]["confirmPassword"].value;

    if (password === confirmPassword)
    {
        var userInfo = {
            username: $('#rUsername').val(),
            name: $('#rName').val(),
            email: $('#rEmail').val(),
            password: $('#rPassword').val(),
        }
        
        $.ajax({
            url:"/api/register",
            method:"post",
            data: userInfo
        })
    
        .done(
            function(response) {
                if (response != undefined || response != null)
                {
                    sessionStorage.setItem("register", true);
                    
                    window.location.href = '/login';
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

        return false;
    }

    else
    {
        alert("The passwords you have entered do not match. Please try again.");

        return false;
    }
}