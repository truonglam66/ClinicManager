let users = [];
let dataOfTable = [];

$(document).ready(function () {
    if (account.Role != 0) {
        window.location.href = '/page_not_found';
    }
    renderSidebar();
    getUsers();
});

function getUsers() {
    $.ajax({
        url: "/manager/getAccounts",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            users = result;
            for (let item of users) {
                item.DateOfBirth = convertCSharpDateToDateObj(item.DateOfBirth);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderUsers();
        }
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IdUser);

        itemTmp.push('<a href="/manager/detail_user/' + item.IdUser + '">' + item.Name + '</a>')

        itemTmp.push(item.DateOfBirth.d + '/' + item.DateOfBirth.m + '/' + item.DateOfBirth.y);

        if (item.Gender) {
            itemTmp.push('Nữ');
        } else {
            itemTmp.push('Nam');
        }

        if (item.Role == 0) {
            itemTmp.push('Quản trị viên');
        } else if (item.Role == 1) {
            itemTmp.push('Bác sĩ');
        } else {
            itemTmp.push('Nhân viên tiếp nhận');
        }

        if (item.Role != 0) {
            if (item.isActive == true) {
                itemTmp.push('<button class="text-xs btn btn-success" onclick="return setStatus(' + item.IdUser + ')">Hoạt động</button>');
            } else {
                itemTmp.push('<button class="text-xs btn btn-danger" onclick="return setStatus(' + item.IdUser + ')">Vô hiệu</button>')
            }
        } else {
            itemTmp.push('');
        }

        itemTmp.push('<div class="btn-group" role="group"><button class="text-xs btn btn-primary" onclick="return getUserById(' + item.IdUser + ')">Cập nhật</button><button class="text-xs btn btn-primary" onclick="return reSetPass(' + item.IdUser + ')">Đặt mật khẩu</button></div>');

        output.push(itemTmp);
    }

    return output;
}

function renderUsers() {
    dataOfTable = generateDataOfTable(users);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataOfTable
    });
}

function setStatus(id) {
    let user = users.find(x => x.IdUser == id);
    let ques;
    let res;
    if (user.isActive) {
        ques = "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này hay không";
        res = "Vô hiệu hóa thành công";
    } else {
        ques = "Bạn có chắc chắn muốn kích hoạt tài khoản này hay không";
        res = "Kích hoạt thành công";
    }

    swal({
        text: ques,
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {
                $.ajax({
                    url: "/manager/setStatus/" + id,
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success(res);
                    },
                    error: function (errormessage) {
                        toastr.error('Thao tác thất bại');
                    },
                    complete: function () {
                        getUsers();
                    }
                });
            }
        });
}

function reSetPass(id) {
    swal({
        text: "Mật khẩu mới sẽ trùng với số chứng minh thư, bạn có chắc chắc muốn tạo lại mật khẩu hay không?",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {
                $.ajax({
                    url: "/manager/reSetPass/" + id,
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success('Tạo lại mật khẩu thành công');
                    },
                    error: function (errormessage) {
                        toastr.error('Tạo lại mật khẩu thất bại');
                    }
                });
            }
        });
}

function getUserById(id) {
    $('#myModal').modal('show');
    $('#updateButton').show();
    $('#addButton').hide();
    $('#identityCardNumber').prop('disabled', true);

    let user = users.find(item => item.IdUser == id);
    $('#idUser').val(user.IdUser);
    $('#name').val(user.Name);
    let d, m;
    if (user.DateOfBirth.d < 10) { d = "0" + user.DateOfBirth.d.toString(); } else { d = user.DateOfBirth.d; };
    if (user.DateOfBirth.m < 10) { m = "0" + user.DateOfBirth.m.toString(); } else { m = user.DateOfBirth.m; };
    $('#dateOfBirth').val(user.DateOfBirth.y + '-' + m + '-' + d);
    $('#identityCardNumber').val(user.IdentityCardNumber);
    $('#address').val(user.Address);
    $('#phone').val(user.Phone);
    if (user.Gender == true) {
        $('#genderFemale').prop('checked', true);
    } else {
        $('#genderMale').prop('checked', true);
    }

    if (user.Role == 1) {
        $('#roleDoctor').prop('checked', true);
    } else if (user.Role == 2) {
        $('#roleReceptionist').prop('checked', true);
    } else {
        $('#roleReceptionist').prop('checked', false);
        $('#roleDoctor').prop('checked', false);
    }
}

function setUser() {
    if (!checkNull()) {
        toastr.warning('Vui lòng điền đầy đủ thông tin trước khi lưu');
    } else {
        let user = users.find(item => item.IdUser == $('#idUser').val());

        user.Name = $('#name').val();
        user.DateOfBirth = $('#dateOfBirth').val();
        user.Address = $('#address').val();
        user.Phone = $('#phone').val();
        if ($('#genderFemale').prop('checked')) {
            user.Gender = 1;
        } else {
            user.Gender = 0;
        }
        if ($('#roleDoctor').prop('checked')) {
            user.Role = 1;
        } else {
            user.Role = 2;
        }

        $.ajax({
            url: "/manager/setAccount",
            data: JSON.stringify(user),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success('Cập nhật thông tin nhân viên thành công');
            },
            error: function (errormessage) {
                toastr.error('Cập nhật thông tin nhân viên thất bại');
            },
            complete: function () {
                getUsers();
                $('#myModal').modal('hide');
            }
        });
    }
}

function createUser() {
    if (!checkNull()) {
        toastr.warning('Vui lòng điền đầy đủ thông tin trước khi lưu');
    } else if (users.find(x => x.IdentityCardNumber == $('#identityCardNumber').val()) != null) {
        toastr.warning('Chứng minh nhân dân này đã tồn tại');
    } else {
        let user = {};

        user.Name = $('#name').val();
        user.DateOfBirth = $('#dateOfBirth').val();
        user.IdentityCardNumber = $('#identityCardNumber').val();
        user.Address = $('#address').val();
        user.Phone = $('#phone').val();
        if ($('#genderFemale').prop('checked')) {
            user.Gender = 1;
        } else {
            user.Gender = 0;
        }
        if ($('#roleDoctor').prop('checked')) {
            user.Role = 1;
        } else {
            user.Role = 2;
        }

        $.ajax({
            url: "/manager/createAccount",
            data: JSON.stringify(user),
            type: "POST",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                toastr.success('Tạo mới nhân viên thành công');
            },
            error: function (errormessage) {
                toastr.error('Tạo mới nhân viên thất bại');
            },
            complete: function () {
                getUsers();
                $('#myModal').modal('hide');
            }
        });
    }
}

function checkNull() {
    if ($('#name').val() == '' || $('#identityCardNumber').val() == '' || $('#address').val() == '' || $('#phone').val() == '') {
        return false;
    } else {
        return true;
    }
}

function clearTextBox() {
    $('#updateButton').hide();
    $('#addButton').show();
    $('#idUser').val("");
    $('#name').val("");
    $('#dateOfBirth').val("");
    $('#identityCardNumber').val("");
    $('#identityCardNumber').prop('disabled', false);
    $('#address').val("");
    $('#phone').val("");
    $('#genderMale').prop('checked', true);
    $('#roleReceptionist').prop('checked', true);
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
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/statistical">
                            <i class="fas fa-fw fa-chart-line"></i>
                            <span>Thống kê</span></a>
                    </li>

                    <!-- Nav Item - Users -->
                    <li class="nav-item active">
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