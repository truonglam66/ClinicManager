let username, password;
let myAccount = {};

$(document).ready(function () {
    localStorage.removeItem("userToken");
    document.getElementById("loginButton").addEventListener("click", login);
    $("body").keyup(function(event){
        if(event.keyCode == 13){
            $("#loginButton").click();
        }
    });
});

function login() {
    getLoginInfo();
    if (username == '' || password == '') {
        toastr.warning('Vui lòng điền đầy đủ thông tin trước khi nhấn đăng nhập');
    } else {
        $.ajax({
            url: "/login/login",
            data: { username: username, password: password },
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                myAccount = result;
                myAccount.TimeLogin = Date.now();
                delete myAccount.Password;
                setAccount(myAccount);
                toastr.success('Đăng nhập thành công');
                window.location.href = "/home";
            },
            error: function (errormessage) {
                loginFail();
            }
        });
    }
}

function getLoginInfo() {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
}

function loginFail() {
    toastr.error('Sai tên đăng nhập, mật khẩu hoặc tài khoản của bạn đã bị vô hiệu hóa. Vui lòng kiểm tra lại');
    document.getElementById('username').style.border = "red 1px solid";
    document.getElementById('password').style.border = "red 1px solid";
}

function setAccount(acc) {
    let userTokenJson = JSON.stringify(acc);
    localStorage.setItem("userToken",userTokenJson);
}

