$(document).ready(function() {

    if (sessionStorage.getItem("login") != null)
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
        url: "/games"
    })
})