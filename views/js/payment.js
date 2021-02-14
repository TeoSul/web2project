$(document).ready(function() {
    if (!sessionStorage.getItem("login"))
    {
        sessionStorage.removeItem("pgamePrice");
        sessionStorage.removeItem("pgameGenre");
        sessionStorage.removeItem("pgameId");
        sessionStorage.removeItem("SgameID");

        window.location.href = '/login';
    }

    else
    {
        var gameName = sessionStorage.getItem("pgameName");
        var gameGenre = sessionStorage.getItem("pgameGenre");
        var gamePrice = sessionStorage.getItem("pgamePrice");

        // $('#gameInformation').html(`
        // <p>Name: ${gameName}</p>
        // <p>Genre: ${gameGenre}</p>
        // <p>Price: ${gamePrice}</p>
        // `);
    }
})

function checkout() {
    var userId = sessionStorage.getItem("userId");

    var gameId = sessionStorage.getItem("SgameID");
    var gamePrice = sessionStorage.getItem("pgamePrice");

    //Payment Information
    var paymentInfo = {
        cardNo: $('#pCardNo').val(),
        cvv: $('#pCVV').val(),
        month: $('#pMonth').val(),
        year: $('#pYear').val(),
        uid: userId,
        gid: gameId,
        price: gamePrice
    }

    $.ajax({
        url: `/api/payment/checkout`,
        method: "post",
        data: paymentInfo
    })

    .done(
        function (response) {
            $("#pStatusMessage").removeClass("error");

            //Error
            if (response === "fail")
            {
                $("#pStatusMessage").html(`
                Unable to make payment. Please try again later.
                `);

                $("#pStatusMessage").addClass("error");
            }

            //If Invalid Card Number
            else if (response === "wrongCard")
            {
                $("#pStatusMessage").html(`
                The card number you have entered is invalid. Please try again.
                `);

                $("#pStatusMessage").addClass("error");
            }

            //If Card Is Expired
            else if (response === "Exped")
            {
                $("#pStatusMessage").html(`
                Your card is expired. Please try again with a card that is still valid.
                `);

                $("#pStatusMessage").addClass("error");
            }

            //If Invalid Card Number And Is Expired
            else if (response === "wrongCardandExped")
            {
                $("#pStatusMessage").html(`
                The card number you have entered is invalid and your card is expired. Please try again with a card that is still valid.
                `);

                $("#pStatusMessage").addClass("error");
            }

            //If Validated
            else
            {
                    sessionStorage.removeItem("pgamePrice");
                    sessionStorage.removeItem("pgameGenre");
                    sessionStorage.removeItem("pgameId");
                    sessionStorage.removeItem("SgameID");

                    window.location.href = "/";
            }
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    );

    return false;
}