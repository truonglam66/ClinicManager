let dataSet = [];
let dataOfTable = [];
let thisDate, thisMonth, thisYear;
let totalPatients, yearPatients, monthPatients, datePatients;

$(document).ready(function () {
    renderSidebar();
    renderThisDate();
    getData();
});

function getThisDate() {
    let d = Date.now();
    d = new Date(d);
    thisDate = d.getDate();
    thisMonth = d.getMonth() + 1;
    thisYear = d.getFullYear();
}

function renderThisDate() {
    getThisDate();
    $('#thisYear').html('Năm ' + thisYear);
    $('#thisMonth').html('Tháng ' + thisMonth);
    $('#thisDate').html('Ngày ' + thisDate + '/' + thisMonth + '/' + thisYear);
}

function getData() {
    $.ajax({
        url: "/community/getPatients",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            for (let item of result) {
                let obj = {};

                // Name
                obj.Name = item.Name;

                // DateOfBirth
                let dObObj = convertCSharpDateToDateObj(item.DateOfBirth);
                //let dOB = dObObj.d + '/' + dObObj.m + '/' + dObObj.y;
                obj.DateOfBirth = dObObj;

                // Gender
                obj.Gender = item.Gender;

                // IdentityCardNumber
                obj.IdentityCardNumber = item.IdentityCardNumber;

                // CreateAt
                let createAt = convertCSharpDateToDateObj(item.CreateAt);
                obj.CreateAt = createAt;

                // IdPatient
                obj.IdPatient = item.IdPatient;

                dataSet.push(obj);
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function() {
            if ($('#filterToday').prop('checked')) {
                renderTableToDay();
            } else {
                renderTable();
            }
            renderCountPatients();
        }
    });
};

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];
        
        let name = '<a href="/community/detail_patient/' + item.IdPatient + '">' + item.Name + '</a>';
        itemTmp.push(name);

        let dOB = item.DateOfBirth.d + '/' + item.DateOfBirth.m + '/' + item.DateOfBirth.y;
        itemTmp.push(dOB);

        if (item.Gender) {
            itemTmp.push('Nữ');
        } else {
            itemTmp.push('Nam');
        }

        itemTmp.push(item.IdentityCardNumber);

        output.push(itemTmp);
    }

    return output;
}

function renderTable() {
    dataOfTable = generateDataOfTable(dataSet);
    $('#patientsTable').DataTable().destroy();
    $('#patientsTable').DataTable({
        data: dataOfTable
    });
}

function renderTableToDay() {
    dataOfTable = generateDataOfTable(dataSet.filter(item => item.CreateAt.d == thisDate && item.CreateAt.m == thisMonth && item.CreateAt.y == thisYear));
    $('#patientsTable').DataTable().destroy();
    $('#patientsTable').DataTable({
        data: dataOfTable
    });
}

function renderCountPatients() {
    totalPatients = dataSet.length;
    yearPatients = dataSet.filter(item => item.CreateAt.y == thisYear).length;
    monthPatients = dataSet.filter(item => item.CreateAt.y == thisYear && item.CreateAt.m == thisMonth).length;
    datePatients = dataSet.filter(item => item.CreateAt.y == thisYear && item.CreateAt.m == thisMonth && item.CreateAt.d == thisDate).length;

    $('#totalPatients').html(totalPatients);
    $('#yearPatients').html(yearPatients);
    $('#monthPatients').html(monthPatients);
    $('#datePatients').html(datePatients);
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