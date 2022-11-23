$(document).ready(function () {
    renderSidebar();
    account.DateOfBirth = convertCSharpDateToDateObj(account.DateOfBirth);
    renderProfileInfo();
    document.getElementById('saveButton').addEventListener('click', setPass);

    let passInput = document.getElementById('passInput');
    let newPass = document.getElementById('newPass');
    let reEnterNewPass = document.getElementById('reEnterNewPass');

    $('#newPass').on('input', checkMatchPass);
    $('#newPass').on('input', checkPassForm);
    $('#reEnterNewPass').on('input', checkMatchPass);
})

function renderProfileInfo() {
    $('#name').html(account.Name);
    $('#dateOfBirth').html(account.DateOfBirth.d + '/' + account.DateOfBirth.m + '/' + account.DateOfBirth.y);
    if (account.Gender) {
        $('#gender').html('Nữ');
    } else {
        $('#gender').html('Nam');
    }
    $('#identityCardNumber').html(account.IdentityCardNumber);
    $('#address').html(account.Address);
    $('#phone').html(account.Phone);
    if (account.Role == 0) {
        $('#role').html('Quản trị viên');
    } else if (account.Role == 1) {
        $('#role').html('Bác sĩ');
    } else {
        $('#role').html('Nhân viên tiếp nhận');
    }
    if (account.isActive == true) {
        $('#status').html('<p class="p-2 badge badge-success">Hoạt động</p>');
    } else {
        $('#status').html('<p class="p-2 badge badge-danger">Vô hiệu</p>');
    }
    $('#username').html(account.Username);

    if (account.Role == 0) {
        $("#avatar").attr('src', '/Template/img/manager.svg');
    } else if (account.Role == 1) {
        if (account.Gender == false) {
            $("#avatar").attr('src', '/Template/img/doctor_male.svg');
        } else {
            $("#avatar").attr('src', '/Template/img/doctor_female.svg');
        }
    } else {
        if (account.Gender == false) {
            $("#avatar").attr('src', '/Template/img/receptionist_male.svg');
        } else {
            $("#avatar").attr('src', '/Template/img/receptionist_female.svg');
        }
    }
}

function checkMatchPass() {
    if (reEnterNewPass.value != newPass.value) {
        reEnterNewPass.style.border = "red 1px solid";
        newPass.style.border = "red 1px solid";
    } else {
        reEnterNewPass.style.border = "#d1d3e2 1px solid";
        newPass.style.border = "#d1d3e2 1px solid";
    }
}

function checkPassForm() {
    if (!/^([a-zA-Z0-9]{6,})$/.test(newPass.value)) {
        newPass.style.border = "red 1px solid";
    } else {
        newPass.style.border = "#d1d3e2 1px solid";
    }
}

function setPass() {
    if (!/^([a-zA-Z0-9]{6,})$/.test(newPass.value)) {
        toastr.warning('Mật khẩu mới cần ít nhất 6 ký tự bao gồm chữ và số');
    } else if (reEnterNewPass.value != newPass.value) {
        toastr.warning('Nhập lại mật khẩu chưa chính xác');
    } else {
        let currentAcc = {};

        $.ajax({
            url: "/manager/getAccountById/" + account.IdUser,
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                currentAcc = result;

                if (currentAcc.Password != passInput.value) {
                    toastr.warning('Mật khẩu hiện tại chưa chính xác, vui lòng kiểm tra lại');
                } else {
                    currentAcc.Password = newPass.value;

                    $.ajax({
                        url: "/manager/setPass",
                        data: JSON.stringify(currentAcc),
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        dataType: "json",
                        success: function (result) {
                            toastr.success('Đổi mật khẩu thành công');
                            window.location.href = '/login';
                        },
                        error: function (errormessage) {
                            alert(errormessage.responseText);
                        }
                    });
                }
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

function convertCSharpDateToDateObj(tmp) {
    let dateStr = tmp.slice(6, -2);
    let date = new Date(parseInt(dateStr));
    let dateObj = {
        tick: dateStr,
        d: date.getDate(),
        m: date.getMonth() + 1,
        y: date.getFullYear()
    }
    return dateObj;
}

function renderSidebar() {
    let content = ``;

    if (account.Role == 0) {
        content = `
        <!-- Divider -->
                    <hr class="sidebar-divider">

                    <!-- Heading -->
                    <div class="sidebar-heading">
                        QUẢN LÝ
                    </div>

                    <!-- Nav Item - Statistical -->
                    <li class="nav-item active">
                        <a class="nav-link" href="/manager/statistical">
                            <i class="fas fa-fw fa-chart-line"></i>
                            <span>Thống kê</span></a>
                    </li>

                    <!-- Nav Item - Users -->
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/users">
                            <i class="fas fa-fw fa-user"></i>
                            <span>Nhân viên</span></a>
                    </li>

                    <!-- Nav Item - Setting -->
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/setting">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>Cài đặt</span></a>
                    </li>
        `
    } else if (account.Role == 1) {
        content = `
        <!-- Divider -->
                    <hr class="sidebar-divider">

                    <!-- Heading -->
                    <div class="sidebar-heading">
                        BÁC SĨ
                    </div>

                    <!-- Nav Item - Examination -->
                    <li class="nav-item">
                        <a class="nav-link" href="/doctor">
                            <i class="fas fa-fw fa-stethoscope"></i>
                            <span>Khám bệnh</span></a>
                    </li>
        `
    } else {
        content = `
        <!-- Divider -->
                    <hr class="sidebar-divider">

                    <!-- Heading -->
                    <div class="sidebar-heading">
                        TIẾP ĐÓN
                    </div>

                    <!-- Nav Item - New Health Record -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/new_health_record">
                            <i class="fas fa-fw fa-plus"></i>
                            <span>Tiếp nhận bệnh nhân</span></a>
                    </li>

                    <!-- Nav Item - ReExamination -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/reexamination">
                            <i class="far fa-fw fa-calendar-check"></i>
                            <span>Tái khám</span></a>
                    </li>

                    <!-- Nav Item - Set the order -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/set_the_order">
                            <i class="fas fa-fw fa-list-ol"></i>
                            <span>Cập nhật thứ tự</span></a>
                    </li>
        `
    }

    $('#sidebarReceptionist').html(content);
}