$(document).ready(function() {

    var SgameID = sessionStorage.getItem("SgameID");

    //Get Game
    $.ajax({
        url: `/api/games/${SgameID}`,
        method: 'get'
    })

    .done(
        function(response) {

        }
    )

    .fail(

    );
})