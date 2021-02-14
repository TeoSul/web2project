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

    //Get Game
    $.ajax({
        url: `/api/respectiveGames/${SgameID}`,
        method:"get"
    })

    .done(
        function(response) {

            $('.gameName').html(`
            ${response.name}
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

function storeTime() {
    stopCount();

    if (confirm("Are you sure you want to leave?"))
    {
        var SuserID = sessionStorage.getItem("userId");

        console.log("Debug: " + SuserID);

        var SgameID = sessionStorage.getItem("SgameID");
        var t = $('#time').val();

        var info = {
            userid: SuserID,
            gameid: SgameID,
            time: t
        }

        //If Got Logged In User
        if (sessionStorage.getItem("login"))
        {
            if (sessionStorage.getItem("allowTracking") === "true")
            {
                $.ajax({
                    url: `/api/games/store`,
                    method: "post",
                    data: info
                })
        
                .done(
                    function (response) {
                        window.close();
                    }
                )
        
                .fail(
                    function(err) {
                        console.log(err.responseText);
                    }
                );
            }

            //Close Game Without Tracking
            else
            {
                window.close();
            }
        }

        //No Logged In User
        else
        {
            //Close Game When User Leaves
            window.close();
        }
    }

    else
    {
        startCount();
    }

    return false;
}