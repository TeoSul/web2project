var count = 0;
var t;
var timerOn = 0;

function timedCount() {
    $('#time').val() = count;
    count = count + 1;
    t = setTimeOut(timedCount, 1000);
}

function startCount() {
    if (!timerOn)
    {
        timerOn = 1;
        timedCount();
    }
}

function stopCount() {
    clearTimeout(t);
    timerOn = 0;
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
            ${response.name};
            `);

            startCount();
        },
    )

    .fail(
        function(err) {
            console.log(err.responseText);
        }
    );
})