let idUser;
let currentUrl;
let user = {};
let healthRecords = [];
let dataOfTable = [];

$(document).ready(function () {
    renderSidebar();
    getCurrentUrl();
    getIdUser();
    getUserById(idUser);
});

function getUserById(id) {
    $.ajax({
        url: "/manager/getAccountById/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            user = result;
            user.DateOfBirth = convertCSharpDateToDateObj(user.DateOfBirth);
            console.log(user);
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function () {
            renderUserInfo();
            getHealthRecordsByIdUser(idUser);
        }
    });
}

function getCurrentUrl() {
    currentUrl = (window.location.href).trim();
    if (currentUrl[currentUrl.length - 1] == '/') {
        currentUrl = currentUrl.slice(0, -1);
    }
}

function getIdUser() {
    let res = currentUrl.split('/');
    let tmp = parseInt(res[res.length - 1]);
    if (!Number.isInteger(tmp)) {
        window.location.href = '/page_not_found';
    } else {
        idUser = tmp;
    }
}

function renderUserInfo() {
    $('#name').html(user.Name);
    $('#dateOfBirth').html(user.DateOfBirth.d + '/' + user.DateOfBirth.m + '/' + user.DateOfBirth.y);
    if (user.Gender) {
        $('#gender').html('Nữ');
    } else {
        $('#gender').html('Nam');
    }
    $('#identityCardNumber').html(user.IdentityCardNumber);
    $('#address').html(user.Address);
    $('#phone').html(user.Phone);
    if (user.Role == 0) {
        $('#role').html('Quản trị viên');
    } else if (user.Role == 1) {
        $('#role').html('Bác sĩ');
    } else {
        $('#role').html('Nhân viên tiếp nhận');
    }
    if (user.isActive == true) {
        $('#status').html('<p class="p-2 badge badge-success">Hoạt động</p>');
    } else {
        $('#status').html('<p class="p-2 badge badge-danger">Vô hiệu</p>');
    }

    if (user.Role == 0) {
        $("#avatar").attr('src', '/Template/img/manager.svg');
    } else if (user.Role == 1) {
        if (user.Gender == false) {
            $("#avatar").attr('src', '/Template/img/doctor_male.svg');
        } else {
            $("#avatar").attr('src', '/Template/img/doctor_female.svg');
        }
    } else {
        if (user.Gender == false) {
            $("#avatar").attr('src', '/Template/img/receptionist_male.svg');
        } else {
            $("#avatar").attr('src', '/Template/img/receptionist_female.svg');
        }
    }
}

function getHealthRecordsByIdUser(id) {
    $.ajax({
        url: "/manager/getHealthRecordsByIdUser/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            healthRecords = result;
            healthRecords = healthRecords.map(function (item) {
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                return item;
            })
            console.log(healthRecords);
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function () {
            renderHealthRecords();
        }
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IdHealthRecord);

        let createAt = item.CreateAt.d + '/' + item.CreateAt.m + '/' + item.CreateAt.y;
        itemTmp.push(createAt);

        let createByUser = '<a href="/manager/detail_user/' + item.CreateByUser + '">' + item.CreateByUser_Name + '</a>';
        itemTmp.push(createByUser);

        if (item.UpdateByUser == null) {
            itemTmp.push("");
        } else {
            let updateByUser = '<a href="/manager/detail_user/' + item.UpdateByUser + '">' + item.UpdateByUser_Name + '</a>';
            itemTmp.push(updateByUser);
        }

        let Patient = '<a href="/community/detail_patient/' + item.IdPatient + '">' + item.Patient_Name + '</a>';
        itemTmp.push(Patient);

        if (item.Diagnosis == null) {
            itemTmp.push("");
        } else {
            itemTmp.push(item.Diagnosis);
        }

        itemTmp.push(item.ExaminationFee);

        if (item.Status) {
            let status = '<span href="#" class="p-2 badge badge-primary">Đang khám</span>';
            itemTmp.push(status);
        } else {
            let status = '<a href="/community/detail_health_record/' + item.IdHealthRecord + '" class="p-2 badge badge-success">Hoàn thành</a></td>';
            itemTmp.push(status);
        }

        output.push(itemTmp);
    }

    return output;
}

function renderHealthRecords() {
    dataOfTable = generateDataOfTable(healthRecords);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataOfTable
    });
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