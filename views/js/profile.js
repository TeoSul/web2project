$(document).ready(function() {
    if (!sessionStorage.getItem("login"))
    {
        window.location.href = '/login';
    }

    else
    {
        var userId = sessionStorage.getItem("userid");

        //Get Profile
        $.ajax({
            url: `/api/profile/${userId}`,
            method:"get"
        })

        .done(
            function (user) {
                $('#viewProfile').html(`
                <p>Email Address: ${user.email}</p><br/>
                <p>Username: ${user.username}</p><br/>
                <p>: ${user.name}</p><br/>
                `)
            }
        )

        .fail(
            function (err) {
                console.log(err.responseText);
            }
        );
    }
})