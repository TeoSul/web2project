function validateRegister() {
    var iPassword = document.forms["registration"]["rPassword"].value;
    var confirmPassword = document.forms["registration"]["confirmPassword"].value;

    console.log(iPassword);
    console.log(confirmPassword);

    if (iPassword === confirmPassword)
    {
        var userInfo = {
            username: $('#rUsername').val(),
            name: $('#rName').val(),
            email: $('#rEmail').val(),
            password: iPassword,
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