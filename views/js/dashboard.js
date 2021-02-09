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
                    data.forEach(function(user) {

                            //User Is Banned
                            if (user.banned)
                            {
                                if (user.userid.toString() === sUID)
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

                                else if (user.admin)
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

                            //User Is Not Banned
                            else
                            {
                                //User
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

                                else if (user.admin)
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
                    
                    //Ban Button onClick
                    $(".banUserBTN").click(function() {
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
                                    }
                    
                                    else
                                    {
                                        $('.DBstatusMessage').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                        return false;
                                    }
                                }
                    
                                else
                                {
                                    $('.DBstatusMessage').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                    return false;
                                }
                            }
                        )
                    
                        .fail(
                            function(err) {
                                console.log(err.responseText);
                            }
                        );

                        return false;
                    });
                    
                    //Unban Button onClick
                    $(".unbanUserBTN").click(function() {
                        var userid = $('.unbanUserBTN').val();

                        var userInfo = {
                            banned: false
                        }

                        $.ajax(
                            {
                                url:`/api/dashboard/unban/${userid}`,
                                method: 'put',
                                data: userInfo
                            }
                        )
                    
                        .done(
                            function(response) {
                                if (response.banned === "false")
                                {
                                    sessionStorage.setItem("bannedUser", false);
                                    
                                    if (sessionStorage.getItem("bannedUser") === "false")
                                    {
                                        window.location.reload();
                                    }
                    
                                    else
                                    {
                                        $('.DBstatusMessage').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                        return false;
                                    }
                                }
                    
                                else
                                {
                                    $('.DBstatusMessage').html(`Unable to execute action on ${response.username}. Please try again later.`);
                    
                                    return false;
                                }
                            }
                        )
                    
                        .fail(
                            function(err) {
                                console.log(err.responseText);
                            }
                        );

                        return false;
                    });
                }
            )

            .fail(
                function (err) {
                    console.log(err.responseText);
                }
            );

            return false;
        }
    }
})