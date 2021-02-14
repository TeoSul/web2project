function validateRegister() {
    var iPassword = document.forms["registration"]["rPassword"].value;
    var confirmPassword = document.forms["registration"]["confirmPassword"].value;

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
                if (response.emailT === "false" && response.unT === "false")
                {
                    sessionStorage.setItem("register", true);
                    
                    window.location.href = '/login';
                }
    
                else
                {
                    if (response.emailT === "false")
                    {
                        if (response.unT === "true")
                        {
                            $("#rStatusMessage").html(`
                            The username you have entered has been associated with an existing account. Please try again with a different username.
                            `);
                        }
                    }

                    else
                    {
                        $("#rStatusMessage").html(`
                        The email address you have entered has been associated with an existing account. Please try again with a different email.
                        `);
                    }
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
        $('#rStatusMessage').html(`
        The passwords you have entered do not match. Please try again.
        `);

        return false;
    }
}