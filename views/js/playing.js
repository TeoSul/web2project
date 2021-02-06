var count = 0;
var t;
var timerOn = false;

function timedCount() {
    $('#time').val(count);
    count = count + 1;
    t = window.setTimeout(timedCount, 1000);
}

function startCount() {
    if (!timerOn)
    {
        timerOn = true;
        timedCount();
    }
}

function stopCount() {
    window.clearTimeout(t);
    timerOn = false;
}

$(document).ready(function() {
    
    var SgameID = sessionStorage.getItem("SgameID");

    console.log(SgameID);

    //Get Game
    $.ajax({
        url: `/api/games/${SgameID}`,
        method:"get"
    })

    .done(
        function(response) {
            $('.gameName').html(`
            ${response.name}
            `);

            console.log("HELLO " + response.name);

            startCount();
        },
    )

    .fail(
        function(err) {
            console.log(err.responseText);
        }
    );
})