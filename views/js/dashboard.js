$(document).ready(function() {
    if (!sessionStorage.getItem("login"))
    {
        window.location.href = '/login';
    }

    else
    {
        var sUID = sessionStorage.getItem("userId");

        if(!sessionStorage.getItem("admin"))
        {
            alert("You do not have authorised access to this page.");
            window.location.href = '/';
        }

        else
        {
            //Get all users
            $.ajax({
                url: "/api/dashboard/users",
                method:"get"
            })

            .done(
                function (data) {

                    console.log("S UID: " + sUID);
                    data.forEach(function(user) {

                        console.log("DB UID: " + user.userid);

                            if (user.banned)
                            {
                                
                                if (user.userid === sUID)
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td class="banStatus" value="${user.banned}"><b style="color: red;">YES</b></td>
                                    <td></td>
                                    </tr>`);
                                }

                                else
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td class="banStatus" value="${user.banned}"><b style="color: red;">YES</b></td>
                                    <td><button class="unbanUserBTN" value="${user.userid}">Unban User</button></td>
                                    </tr>`);
                                }
                            }

                            else
                            {
                                if (user.userid === sUID)
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td><b style="color: green;">NO</b></td>
                                    <td class="banStatus"></td>
                                    </tr>`);
                                }

                                else
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td><b style="color: green;">NO</b></td>
                                    <td class="banStatus"><button class="banUserBTN" value="${user.userid}">Ban User</button></td>
                                    </tr>`);
                                }
                            }
                    })
                    
                    $(".banUserBTN").click(function() {
                        console.log("test");
        
                        var userid = $('.banUserBTN').val();
                    
                        console.log("Banning: " + userid);
                    
                        var userInfo = {
                            banned: true
                        }
                    
                        $.ajax(
                            {
                                url:`/api/dashboard/ban/${userid}`,
                                method: 'put',
                                data: userInfo
                            }
                            
                        )
                    
                        .done(
                            function(response) {
                                if (response.banned)
                                {
                                    sessionStorage.setItem("bannedUser", true);
                    
                                    if (sessionStorage.getItem("bannedUser"))
                                    {
                                        window.location.reload();

                                        $('.DBstatusMessageS').html(`You have successfully executed a ban on ${response.username}`);
                                    }
                    
                                    else
                                    {
                                        $('.DBstatusMessageF').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                        return false;
                                    }
                                }
                    
                                else
                                {
                                    $('.DBstatusMessageF').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                    return false;
                                }
                    
                            }
                        )
                    
                        .fail(
                            function(err) {
                                console.log(err.responseText);
                            }
                        );
                    });
                    
                    $('.unbanUserBTN').on('click', function() {
                        $.ajax(
                            {
                                url:`/api/dashboard/unban/${userid}`,
                                method: 'put'
                            }
                        )
                    
                        .done(
                            function(response) {
                                window.location.reload();
                            }
                        )
                    
                        .fail(
                            function(err) {
                                console.log(err.responseText);
                            }
                        );
                    });
                }
            )

            .fail(
                function (err) {
                    console.log(err.responseText);
                }
            );

            
        }
    }
})