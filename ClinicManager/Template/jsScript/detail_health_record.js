let idHealthRecord;
let currentUrl;
let healthRecord = {};
let prescription = [];
let dataOfTable = [];

$(document).ready(function () {
    renderSidebar();
    getCurrentUrl();
    getIdHealthRecord();
    getHealthRecordByID(idHealthRecord);
});

function getHealthRecordByID(id) {
    $.ajax({
        url: "/community/getHealthRecordById/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            healthRecord = result;
            healthRecord.CreateAt = convertCSharpDateToDateObj(healthRecord.CreateAt);
            if (healthRecord.ReExaminationAt != null)
                healthRecord.ReExaminationAt = convertCSharpDateToDateObj(healthRecord.ReExaminationAt);
        },
        error: function (errormessage) {
            window.location.href = '/page_not_found';
        },
        complete: function () {
            renderHealthRecordInfo();
            getPrescription(idHealthRecord);
        }
    });
}

function getPrescription(id) {
    $.ajax({
        url: "/community/GetPrescriptionByIdHealthRecord/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            prescription = result;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderPrescription();
        }
    });
}

function getCurrentUrl() {
    currentUrl = (window.location.href).trim();
    if (currentUrl[currentUrl.length - 1] == '/') {
        currentUrl = currentUrl.slice(0, -1);
    }
}

function getIdHealthRecord() {
    let res = currentUrl.split('/');
    let tmp = parseInt(res[res.length - 1]);
    if (!Number.isInteger(tmp)) {
        window.location.href = '/page_not_found';
    } else {
        idHealthRecord = tmp;
    }
}

function renderHealthRecordInfo() {
    $('#idHealthRecord').html(healthRecord.IdHealthRecord);

    let createAt = healthRecord.CreateAt.d + '/' + healthRecord.CreateAt.m + '/' + healthRecord.CreateAt.y;
    $('#createAt').html(createAt);

    $('#createByUser_Name').html(healthRecord.CreateByUser_Name);

    $('#examinationFee').html(healthRecord.ExaminationFee);

    if (healthRecord.IsReExamination) {
        $('#isExamination').html('<p class="p-2 badge badge-info">T??i kh??m</p>');
    } else {
        $('#isExamination').html('<p class="p-2 badge badge-success">Kh??m m???i</p>');
    }

    if (healthRecord.UpdateByUser_Name == null) {
        $('#updateByUser_Name').html("Kh??ng x??c ?????nh");
    } else {
        $('#updateByUser_Name').html(healthRecord.UpdateByUser_Name);
    }

    $('#patient_Name').html(healthRecord.Patient_Name);

    if (healthRecord.Status) {
        $('#status').html('<p class="p-2 badge badge-danger">??ang kh??m</p>');
    } else {
        $('#status').html('<p class="p-2 badge badge-success">???? ho??n th??nh</p>');
    }

    if (healthRecord.Symptom == null) {
        $('#symptom').html('Kh??ng x??c ?????nh');
    } else {
        $('#symptom').html(healthRecord.Symptom);
    }

    if (healthRecord.Diagnosis == null) {
        $('#diagnosis').html('Kh??ng x??c ?????nh');
    } else {
        $('#diagnosis').html(healthRecord.Diagnosis);
    }

    if (healthRecord.ReExaminationAt == null) {
        $('#reExaminationAt').html('Kh??ng x??c ?????nh');
    } else {
        let reExaminationAt = healthRecord.ReExaminationAt.d + '/' + healthRecord.ReExaminationAt.m + '/' + healthRecord.ReExaminationAt.y;
        $('#reExaminationAt').html(reExaminationAt);
    }
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.MedicineName);
        itemTmp.push(item.Unit);
        itemTmp.push(item.Count);
        itemTmp.push(item.UserManual);

        output.push(itemTmp);
    }

    return output;
}

function renderPrescription() {
    dataOfTable = generateDataOfTable(prescription);
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
                        QU???N L??
                    </div>

                    <!-- Nav Item - Statistical -->
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/statistical">
                            <i class="fas fa-fw fa-chart-line"></i>
                            <span>Th???ng k??</span></a>
                    </li>

                    <!-- Nav Item - Users -->
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/users">
                            <i class="fas fa-fw fa-user"></i>
                            <span>Nh??n vi??n</span></a>
                    </li>

                    <!-- Nav Item - Setting -->
                    <li class="nav-item">
                        <a class="nav-link" href="/manager/setting">
                            <i class="fas fa-fw fa-wrench"></i>
                            <span>C??i ?????t</span></a>
                    </li>
        `
    } else if (account.Role == 1) {
        content = `
        <!-- Divider -->
                    <hr class="sidebar-divider">

                    <!-- Heading -->
                    <div class="sidebar-heading">
                        B??C S??
                    </div>

                    <!-- Nav Item - Examination -->
                    <li class="nav-item">
                        <a class="nav-link" href="/doctor">
                            <i class="fas fa-fw fa-stethoscope"></i>
                            <span>Kh??m b???nh</span></a>
                    </li>
        `
    } else {
        content = `
        <!-- Divider -->
                    <hr class="sidebar-divider">

                    <!-- Heading -->
                    <div class="sidebar-heading">
                        TI???P ????N
                    </div>

                    <!-- Nav Item - New Health Record -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/new_health_record">
                            <i class="fas fa-fw fa-plus"></i>
                            <span>Ti???p nh???n b???nh nh??n</span></a>
                    </li>

                    <!-- Nav Item - ReExamination -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/reexamination">
                            <i class="far fa-fw fa-calendar-check"></i>
                            <span>T??i kh??m</span></a>
                    </li>

                    <!-- Nav Item - Set the order -->
                    <li class="nav-item">
                        <a class="nav-link" href="/receptionist/set_the_order">
                            <i class="fas fa-fw fa-list-ol"></i>
                            <span>C???p nh???t th??? t???</span></a>
                    </li>
        `
    }

    $('#sidebarReceptionist').html(content);
}