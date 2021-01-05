$(document).ready(function() {

})

function validateRegister() {
    var password = document.forms["registration"]["password"].value;

    var confirmPassword = document.forms["registration"]["confirmPassword"].value;

    if (password === confirmPassword)
    {
        return true;
    }

    else
    {
        alert("The passwords you have entered do not match. Please try again.");

        return false;
    }
}