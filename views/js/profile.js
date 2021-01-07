$(document).ready(function() {
    if (sessionStorage.getItem("login") === false)
    {
        window.location.href = '/login';
    }
})