$(document).ready(function() {

    if (sessionStorage.getItem("login") === true)
    {
        $(".navigation").append(`
            <ul>
                <li>Home</li>
                <li>Test</li>
                <li>Profile</li>
                <li>Log Out</li>
            </ul>
        `);
    }

    $.ajax({
        url: "/login",
        method:"post"
    })

    .done(
        function (response) {
            sessionStorage.setItem("login", true);
            sessionStorage.setItem("userId", response.userId);
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );
})