$(document).ready(function() {
    if (!sessionStorage.getItem("login"))
    {
        window.location.href = '/login';
    }

    else
    {
        var userId = sessionStorage.getItem("userId");

        console.log("User ID: " + userId);

        //Get Profile
        $.ajax({
            url: `/api/profile/${userId}`,
            method:"get"
        })

        .done(
            function (user) {

                $('#viewProfile').html(`
                <h3>Profile</h3>
                <p>Email Address: ${user.email}</p>
                <p>Username: ${user.username}</p>
                <p>Name: ${user.name}</p><br/>
                `);

                $('#editProfile').html(`
                <h3>Edit Profile</h3>

                <form onsubmit="return updateProfile();">
                <label>Email Address: </label>
                <input type="email" name="eEmail" id="eEmail" value="${user.email}" required><br/><br/>

                <label>Username: </label>
                <input type="text" name="eUsername" id="eUsername" value="${user.username}" required><br/><br/>
                
                <label>Name: </label>
                <input type="text" name="eName" id="eName" value="${user.name}" required><br/><br/>

                <label>Password: </label>
                <input type="password" name="ePassword" id="c2ePassword" required><br/>
                <span style="color: red">Enter your current password to make the change(s).</span><br/><br/>

                <input type="submit" value="Update Profile">
                </form>
                `);
            }
        )

        .fail(
            function (err) {
                console.log(err.responseText);
            }
        );
    }
})

function updateProfile(){
    var userId = sessionStorage.getItem("userId");

    var editInfo = {
        email: $('#eEmail').val(),
        username: $('#eUsername').val(),
        name: $('#eName').val(),
        password: $('#c2ePassword').val()
    }

    console.log(editInfo);

    $.ajax({
        url: `/api/profile/${userId}`,
        type: "put",
        data: editInfo
    })

    .done(
        function(response) {
            console.log(response);
            
            if (response != undefined || response != null)
            {
                sessionStorage.setItem("edit", true);

                console.log("Edit Session: " + sessionStorage.getItem("edit"));

                if (sessionStorage.getItem("edit"))
                {
                    $("#eStatusMessageS").html(`
                    You have successfully updated your profile!
                    `);

                    window.location.reload();
                }

                else
                {
                    $("#eStatusMessageF").html(`
                    Unable to update profile. Please try again later.
                    `);

                    return false;
                }
            }

            else
            {
                $("#eStatusMessageF").html(`
                The password you have entered does not match with your current password. Please try again.
                `);

                return false;
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