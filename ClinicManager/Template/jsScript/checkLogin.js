let account;
const durationOfOneSession = 3600000;

$(document).ready(function () {
    account = getAccount();
    if (account == null) {
        window.location.href = "/login";
    } else {
        if (Date.now() - account.TimeLogin > durationOfOneSession || account.IsActive == false) {
            window.location.href = "/login";
        } else {
            account.TimeLogin = Date.now();
            setAccount(account);
            setProfile();
        }
    }
})

function getAccount() {
    let userTokenJson = localStorage.getItem("userToken");
    if (userTokenJson == null || JSON.parse(localStorage.getItem("userToken")).Username == null) return null;
    let userToken = JSON.parse(userTokenJson);
    return userToken;
}

function setAccount(acc) {
    let userTokenJson = JSON.stringify(acc);
    localStorage.setItem("userToken", userTokenJson);
}

function setProfile() {
    $("#profileName").html(account.Name);

    if (account.Role == 0) {
        $("#profileAvatar").attr('src', '/Template/img/manager.svg');
    } else if (account.Role == 1) {
        if (account.Gender == false) {
            $("#profileAvatar").attr('src', '/Template/img/doctor_male.svg');
        } else {
            $("#profileAvatar").attr('src', '/Template/img/doctor_female.svg');
        }
    } else {
        if (account.Gender == false) {
            $("#profileAvatar").attr('src', '/Template/img/receptionist_male.svg');
        } else {
            $("#profileAvatar").attr('src', '/Template/img/receptionist_female.svg');
        }
    }


}