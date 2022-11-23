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
        text: "Bạn có chắc chắc muốn xóa phiếu khám này khỏi hàng đợi?",
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
                        toastr.success('Thành công');
                    },
                    error: function (errormessage) {
                        toastr.error('Thất bại');
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
        text: "Hãy chắc chắn rằng bạn đã lưu thông tin của phiếu khám cũ trước khi làm việc với bệnh nhân này?",
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
                    $('#isExamination').html('<p class="p-2 badge badge-info">Tái khám</p>');
                } else {
                    $('#isExamination').html('<p class="p-2 badge badge-success">Khám mới</p>');
                }
                loadTextBox();
            }
        });
}

function save() {
    let idHealthRecord = $('#idHealthRecord').html();
    if (idHealthRecord == '' || idHealthRecord == null) {
        toastr.error('Không có gì để lưu');
    } else if ($('#diagnosis').val() == '' || $('#symptom').val() == '') {
        toastr.error('Vui lòng điển đầy đủ thông tin trước khi lưu');
    } else {
        swal({
            text: "Sau khi lưu, bạn sẽ không thể thao tác với phiếu khám này nữa, bạn đã chắc chắn hay chưa?",
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
            toastr.error('Thất bại');
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
            toastr.error('Thất bại');
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
                toastr.success('Thành công');
            },
            error: function (errormessage) {
                toastr.error('Thất bại');
            }
        });
    } else {
        toastr.success('Thành công');
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
        toastr.warning('Vui lòng điền đầy đủ thông tin trước khi thêm');
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
                    <li class="nav-item active">
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