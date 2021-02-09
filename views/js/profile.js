$(document).ready(function() {
    if (!sessionStorage.getItem("login"))
    {
        window.location.href = '/login';
    }

    else
    {
        var userId = sessionStorage.getItem("userId");

        //Get Profile
        $.ajax({
            url: `/api/profile/${userId}`,
            method:"get"
        })

        .done(
            function (data) {
                $('#viewProfile').html(`
                <h3>Profile</h3>
                <p>Email Address: ${data.user.email}</p>
                <p>Username: ${data.user.username}</p>
                <p>Name: ${data.user.name}</p><br/>
                `);

                $('#editProfile').html(`
                <h3>Edit Profile</h3>

                <form onsubmit="return updateProfile();">
                <label>Email Address: </label>
                <input type="email" name="eEmail" id="eEmail" value="${data.user.email}" required><br/><br/>

                <label>Username: </label>
                <input type="text" name="eUsername" id="eUsername" value="${data.user.username}" required><br/><br/>
                
                <label>Name: </label>
                <input type="text" name="eName" id="eName" value="${data.user.name}" required><br/><br/>

                <label>Password: </label>
                <input type="password" name="ePassword" id="c2ePassword" required><br/>
                <span style="color: red">Enter your current password to make the change(s).</span><br/><br/>

                <input type="submit" value="Update Profile">
                </form>
                `);

                if (Object.keys(data).length > 1)
                {
                    data.statistics.forEach(function(stat) {
                        data.games.forEach(function(game) {
                            if (stat.gameid === game.gameid)
                            {
                                $('#timePlayed').append(`
                                <tr>
                                <td>${game.name}</td>
                                <td>${game.genre}</td>
                                <td>${stat.time} seconds</td>
                                </tr>
                                `);
                            }
                        });
                    });
                }

                else
                {
                    $('#timePlayed').html(`
                    <tr>
                    <td colspan="3">You have not played any games yet.</td>
                    </tr>
                    `);
                }

                if (sessionStorage.getItem("admin") === "true")
                {
                    $('#administration').html(`

                    <h3>Administration</h3>

                    <form method="get" action="/dashboard">
                    <input type="submit" value="Admin Dashboard">
                    </form>
                    `);
                }

                if (data.user.allowTracking === true)
                {
                    $('#accountSettings').html(`
                    <h3>Account Settings</h3>

                    <form onsubmit="return updateSettings();">
                    <label>Playing Time Tracking: </label>
                    <input type="checkbox" id="trackingConfig" checked><br/><br/>

                    <input type="submit" value="Update Settings"><br/>
                    </form>
                    `);
                }

                else
                {
                    $('#accountSettings').html(`
                    <h3>Account Settings</h3>

                    <form onsubmit="return updateSettings();">
                    <label>Playing Time Tracking: </label>
                    <input type="checkbox" id="trackingConfig"><br/><br/>

                    <input type="submit" value="Update Settings"><br/>
                    </form>
                    `);
                }
            }
        )

        .fail(
            function (err) {
                console.log(err.responseText);
            }
        );
    }
})

//Update Profile
function updateProfile(){
    var userId = sessionStorage.getItem("userId");

    var editInfo = {
        email: $('#eEmail').val(),
        username: $('#eUsername').val(),
        name: $('#eName').val(),
        password: $('#c2ePassword').val()
    }

    $.ajax({
        url: `/api/profile/${userId}`,
        type: "put",
        data: editInfo
    })

    .done(
        function(response) {         
            //If Verified Password  
            if (Object.keys(response).length > 0)
            {
                sessionStorage.setItem("edit", true);

                $("#eStatusMessage").removeClass("error");
                $("#eStatusMessage").removeClass("success");

                if (sessionStorage.getItem("edit"))
                {
                    $('#viewProfile').html(`
                    <h3>Profile</h3>
                    <p>Email Address: ${response.email}</p>
                    <p>Username: ${response.username}</p>
                    <p>Name: ${response.name}</p><br/>
                    `);

                    $("#eStatusMessage").html(`
                    You have successfully updated your profile!
                    `);

                    $("#eStatusMessage").addClass("success");
                }

                else
                {
                    $("#eStatusMessage").html(`
                    Unable to update profile. Please try again later.
                    `);

                    $("#eStatusMessage").addClass("error");
                }
            }

            else
            {
                $("#eStatusMessage").html(`
                The password you have entered does not match with your current password. Please try again.
                `);

                $("#eStatusMessage").addClass("error");
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

//Update Settings
function updateSettings() {
    var userId = sessionStorage.getItem("userId");

    var info = {
        allowTracking: $('#trackingConfig').prop("checked")
    }

    $.ajax({
        url: `/api/profile/settings/${userId}`,
        method: "put",
        data: info
    })

    .done(
        function (response) {
            console.log(response);

            sessionStorage.setItem("allowTracking", response.allowTracking);

            $("#eStatusMessage").removeClass("error");
            $("#eStatusMessage").removeClass("success");

            if (response != null || response != undefined)
            {
                $("#eStatusMessage").html(`
                You have successfully configured your account!
                `);

                $("#eStatusMessage").addClass("success");
            }

            else
            {
                $("#eStatusMessage").html(`
                Unable to configure your account. Please try again later.
                `);

                $("#eStatusMessage").addClass("error");
            }
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    )

    return false;
}

//Delete Account
function deleteAccount() {
    var userId = sessionStorage.getItem("userId");

    var vInfo = {
        password: $('#vPassword').val()
    }

    $.ajax({
        url: `/api/profile/delete/${userId}`,
        method: "delete",
        data: vInfo
    })

    .done(
        function (response) {
            $("#eStatusMessage").removeClass("success");
            $("#eStatusMessage").removeClass("error");

            if (response === "lead")
            {
                alert("You have successfully deleted your account!");

                window.location.href = "/delete";
            }

            else
            {
                if (response === "whatlead")
                {
                    $("#eStatusMessage").html(`
                    The password you have entered does not match with your current password. Please try again.
                    `);

                    $("#eStatusMessage").addClass("error");
                }

                else
                {
                    $("#eStatusMessage").html(`
                    Unable to delete your account. Please try again later.
                    `);

                    $("#eStatusMessage").addClass("error");
                }
            }
        }
    )

    .fail(
        function (err) {
            console.log(err.responseText);
        }
    )

    return false;
}