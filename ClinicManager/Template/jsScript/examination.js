let queues = [];
let dataTableOfQueues = [];

let prescription = [];
let dataTableOfPrescription = [];

$(document).ready(function () {
    if (account.Role != 1) {
        window.location.href = '/page_not_found';
    }
    renderSidebar();
    clearTextBox();
});

function getQueues() {
    $.ajax({
        url: "/home/getQueues",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            queues = result;
            queues = queues.map(function (item) {
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                return item;
            })
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderQueues();
        }
    });
}

function renderQueues() {
    dataTableOfQueues = generateDataOfTable_Queues(queues);
    $('#queueTable').DataTable().destroy();
    $('#queueTable').DataTable({
        data: dataTableOfQueues
    });
}

function generateDataOfTable_Queues(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IndexOfDay);
        itemTmp.push(item.Patient_Name);
        itemTmp.push('<div class="btn-group" role="group"><button type="button" class="btn btn-success" onclick="return selectHealthRecord(' + item.IdHealthRecord + ')"><i class="fas fa-check"></i></button><button type="button" class="btn btn-danger" onclick="return setTheOrderbyId(' + item.IdHealthRecord + ')"><i class="fas fa-trash-alt"></i></button></div>');

        output.push(itemTmp);
    }

    return output;
}

function renderPrescription() {
    dataTableOfPrescription = generateDataOfTable_Prescription(prescription);
    $('#prescriptionTable').DataTable().destroy();
    $('#prescriptionTable').DataTable({
        data: dataTableOfPrescription
    });
}

function generateDataOfTable_Prescription(input) {
    output = [];
    for (let [index, item] of input.entries()) {
        let itemTmp = [];

        itemTmp.push(item.MedicineName);
        itemTmp.push(item.Unit);
        itemTmp.push(item.Count);
        itemTmp.push(item.UserManual);
        itemTmp.push('<button type="button" class="btn btn-secondary" onclick="return deletePrescription(' + index + ');"><i class="fas fa-backspace"></i></button>');

        output.push(itemTmp);
    }

    return output;
}

function setTheOrderbyId(id) {
    swal({
        text: "B???n c?? ch???c ch???c mu???n x??a phi???u kh??m n??y kh???i h??ng ?????i?",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {

                $.ajax({
                    url: "/receptionist/setTheOrderById/" + id,
                    type: "POST",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        toastr.success('Th??nh c??ng');
                    },
                    error: function (errormessage) {
                        toastr.error('Th???t b???i');
                    },
                    complete: function () {
                        getQueues();
                    }
                });
            }
        });
}

function selectHealthRecord(id) {

    swal({
        text: "H??y ch???c ch???n r???ng b???n ???? l??u th??ng tin c???a phi???u kh??m c?? tr?????c khi l??m vi???c v???i b???nh nh??n n??y?",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {
                prescription = [];
                renderPrescription();

                let healthRecord = queues.find(x => x.IdHealthRecord == id);

                $('#myModal').modal('hide');
                $('#patient_Name').html('<a target="_blank" href="community/detail_patient/' + healthRecord.IdPatient + '">' + healthRecord.Patient_Name + '</a>');
                $('#idHealthRecord').html(healthRecord.IdHealthRecord);
                $('#createAt').html(healthRecord.CreateAt.d + '/' + healthRecord.CreateAt.m + '/' + healthRecord.CreateAt.y);
                if (healthRecord.IsReExamination) {
                    $('#isExamination').html('<p class="p-2 badge badge-info">T??i kh??m</p>');
                } else {
                    $('#isExamination').html('<p class="p-2 badge badge-success">Kh??m m???i</p>');
                }
                loadTextBox();
            }
        });
}

function save() {
    let idHealthRecord = $('#idHealthRecord').html();
    if (idHealthRecord == '' || idHealthRecord == null) {
        toastr.error('Kh??ng c?? g?? ????? l??u');
    } else if ($('#diagnosis').val() == '' || $('#symptom').val() == '') {
        toastr.error('Vui l??ng ??i???n ?????y ????? th??ng tin tr?????c khi l??u');
    } else {
        swal({
            text: "Sau khi l??u, b???n s??? kh??ng th??? thao t??c v???i phi???u kh??m n??y n???a, b???n ???? ch???c ch???n hay ch??a?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then((result) => {
                if (result) {
                    saveHealthRecord();
                }
            });
    }
}

function saveHealthRecord() {
    let idHealthRecord = $('#idHealthRecord').html();
    let healthRecord = queues.find(x => x.IdHealthRecord == idHealthRecord);

    healthRecord.Symptom = $('#symptom').val();
    healthRecord.Diagnosis = $('#diagnosis').val();
    healthRecord.UpdateByUser = account.IdUser;

    $.ajax({
        url: "/doctor/setHealthRecord",
        data: JSON.stringify(healthRecord),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            savePrescription();
        },
        error: function (errormessage) {
            toastr.error('Th???t b???i');
        }
    });
}

function savePrescription() {
    $.ajax({
        url: "/doctor/createPrescription",
        data: JSON.stringify(prescription),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            saveReExamination();
        },
        error: function (errormessage) {
            toastr.error('Th???t b???i');
        }
    });
}

function saveReExamination() {
    let idHealthRecord = $('#idHealthRecord').html();
    if ($('#willReExamination').prop('checked')) {
        let reExamination = {
            IdHealthRecord: idHealthRecord.toString(),
            ReExaminationAt: $('#reExaminationAt').val()
        }

        $.ajax({
            url: "/doctor/createReExamination",
            data: JSON.stringify(reExamination),
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                toastr.success('Th??nh c??ng');
            },
            error: function (errormessage) {
                toastr.error('Th???t b???i');
            }
        });
    } else {
        toastr.success('Th??nh c??ng');
    }
    clearTextBox();
}

function setWillReExamination() {
    $('#reExaminationAt').val('');
    let date = new Date(Date.now());
    if (date.getDate() < 10) { d = "0" + date.getDate().toString(); } else { d = date.getDate(); };
    if (date.getMonth() < 9) { m = "0" + (date.getMonth() + 1).toString(); } else { m = date.getMonth() + 1; };
    if ($('#willReExamination').prop('checked')) {
        $('#reExaminationAt').val(date.getFullYear() + '-' + m + '-' + d);
        $('#reExaminationAt').prop('disabled', false);
    } else {
        $('#reExaminationAt').prop('disabled', true);
    }
}

function addPrescription() {
    let medicineName = $('#medicineName').val();
    let unit = $('#unit').val();
    let count = $('#count').val();
    count = parseInt(count);

    if (medicineName == '' || unit == '' || isNaN(count) || count < 1) {
        toastr.warning('Vui l??ng ??i???n ?????y ????? th??ng tin tr?????c khi th??m');
    } else {
        item = {
            IdHealthRecord: $('#idHealthRecord').html(),
            MedicineName: $('#medicineName').val(),
            Unit: $('#unit').val(),
            Count: $('#count').val(),
            UserManual: $('#userManual').val()
        }

        prescription.push(item);
        renderPrescription();
        $('#medicineName').val('');
        $('#unit').val('');
        $('#count').val('1');
        $('#userManual').val('');
    }
}

function deletePrescription(id) {
    prescription.splice(id, 1);
    renderPrescription();
    console.log(prescription.length);
}

function clearTextBox() {
    $('#patient_Name').html('');
    $('#idHealthRecord').html('');
    $('#createAt').html('');
    $('#isExamination').html('');
    $('#symptom').val('');
    $('#symptom').prop('disabled', true);
    $('#diagnosis').val('');
    $('#diagnosis').prop('disabled', true);
    $('#willReExamination').prop('checked', false);
    $('#willReExamination').prop('disabled', true);
    $('#reExaminationAt').val('');
    $('#reExaminationAt').prop('disabled', true);
    $('#saveButton').prop('disabled', true);
    $('#medicineName').val('');
    $('#medicineName').prop('disabled', true);
    $('#unit').val('');
    $('#unit').prop('disabled', true);
    $('#count').val('');
    $('#count').prop('disabled', true);
    $('#userManual').val('');
    $('#userManual').prop('disabled', true);
    $('#addPrescription').prop('disabled', true);
}

function loadTextBox() {
    $('#symptom').val('');
    $('#symptom').prop('disabled', false);
    $('#diagnosis').val('');
    $('#diagnosis').prop('disabled', false);
    $('#willReExamination').prop('checked', false);
    $('#willReExamination').prop('disabled', false);
    $('#saveButton').prop('disabled', false);
    $('#medicineName').val('');
    $('#medicineName').prop('disabled', false);
    $('#unit').val('');
    $('#unit').prop('disabled', false);
    $('#count').val('1');
    $('#count').prop('disabled', false);
    $('#userManual').val('');
    $('#userManual').prop('disabled', false);
    $('#addPrescription').prop('disabled', false);
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
                    <li class="nav-item active">
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