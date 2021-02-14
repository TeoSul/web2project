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
            alert("You do not have authorised access to this page!");
            window.location.href = '/';
        }

        else
        {
            //Get all users
            $.ajax({
                url: "/api/dashboard",
                method:"get"
            })

            .done(
                function (data) {
                    data.u.forEach(function(user) {
                            //User Is Banned
                            if (user.banned)
                            {
                                //If User Is Current User
                                if (user.userid.toString() === sUID)
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td class="banStatus" value="${user.banned}"><b style="color: red;"><span id="banValue${user.userid}">YES</span></b></td>
                                    <td></td>
                                    </tr>`);
                                }

                                //User Is Not Current User
                                else
                                {
                                    //If User Is An Admin
                                    if (user.role === "Admin")
                                    {
                                        $(".DBusers").append(`
                                        <tr>
                                        <td>${user.userid}</td>
                                        <td>${user.username}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.role}</td>
                                        <td class="banStatus" value="${user.banned}"><b style="color: red;"><span id="banValue${user.userid}">YES</span></b></td>
                                        <td></td>
                                        </tr>`);
                                    }

                                    //User Is Not An Admin
                                    else
                                    {
                                        $(".DBusers").append(`
                                        <tr>
                                        <td>${user.userid}</td>
                                        <td>${user.username}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.role}</td>
                                        <td class="banStatus" value="${user.banned}"><b style="color: red;"><span id="banValue${user.userid}">YES</span></b></td>
                                        <td><button class="unbanUserBTN${user.userid}" value="${user.userid}">Unban User</button></td>
                                        </tr>`);
                                    }

                                    //Unban Button onClick
                                    $(`.unbanUserBTN${user.userid}`).click(function() {
                                        var userid = $(`.unbanUserBTN${user.userid}`).val();
                                    
                                        var userInfo = {
                                            uid: userid,
                                            banned: false
                                        }

                                        $.ajax(
                                            {
                                                url:`/api/dashboard/unban/`,
                                                method: 'put',
                                                data: userInfo
                                            }
                                        )
                                    
                                        .done(
                                            function(response) {

                                                if (response.banned === "false")
                                                {
                                                    window.location.reload();
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
                            }

                            //User Is Not Banned
                            else
                            {
                                //If User Is Current User
                                if (user.userid === sUID)
                                {
                                    $(".DBusers").append(`
                                    <tr>
                                    <td>${user.userid}</td>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td><b style="color: green;"><span id="banValue${user.userid}">NO</span></b></td>
                                    <td class="banStatus"></td>
                                    </tr>`);
                                }

                                //User Is Not Current User
                                else
                                {
                                    //If User Is An Admin
                                    if (user.role === "Admin")
                                    {
                                        $(".DBusers").append(`
                                        <tr>
                                        <td>${user.userid}</td>
                                        <td>${user.username}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.role}</td>
                                        <td><b style="color: green;"><span id="banValue${user.userid}">NO</span></b></td>
                                        <td class="banStatus"></td>
                                        </tr>`);
                                    }

                                    //User Is Not An Admin
                                    else
                                    {
                                        $(".DBusers").append(`
                                        <tr>
                                        <td>${user.userid}</td>
                                        <td>${user.username}</td>
                                        <td>${user.name}</td>
                                        <td>${user.email}</td>
                                        <td>${user.role}</td>
                                        <td><b style="color: green;"><span id="banValue${user.userid}">NO</span></b></td>
                                        <td class="banStatus"><span id="banAction${user.userid}"><button class="banUserBTN${user.userid}" value="${user.userid}">Ban User</button></span></td>
                                        </tr>`);
                                    }

                                    //Ban Button onClick
                                    $(`.banUserBTN${user.userid}`).click(function() {
                                        var userid = $(`.banUserBTN${user.userid}`).val();

                                        console.log("FF: " + userid);
                                    
                                        var userInfo = {
                                            uid: userid,
                                            banned: true
                                        }
                                    
                                        $.ajax(
                                            {
                                                url:`/api/dashboard/ban/`,
                                                method: 'put',
                                                data: userInfo
                                            }  
                                        )
                                    
                                        .done(
                                            function(response) {
                                                if (response.banned)
                                                {
                                                    window.location.reload();
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
                            }
                    })

                    data.l.forEach(function(log) {
                        var userid = log.userid;

                        $.ajax({
                            url: `/api/dashboard/getUN/${userid}`,
                            method:"get"
                        })

                        .done(
                            function (response) { 
                                $('.DBlogs').append(`
                                <tr>
                                <td>${log.logid}</td>
                                <td>${response.username}</td>
                                <td>${log.description}</td>
                                <td>${log.category}</td>
                                <td>${log.timestamp}</td>
                                </tr>
                                `);

                                // else
                                // {
                                //     $('.DBlogs').append(`
                                //     <tr>
                                //     <td colspan="5">Server logs is currently unavailable.</td>
                                //     </tr>
                                //     `);
                                // }
                            }
                        )

                        .fail(
                            function(err) {
                                console.log(err.responseText);
                            }
                        )

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