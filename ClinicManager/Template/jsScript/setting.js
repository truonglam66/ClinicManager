let constant = {};

$(document).ready(function () {
    if (account.Role != 0) {
        window.location.href = '/page_not_found';
    }
    renderSidebar();
    getExaminationFee();
    $('#examinationFee').on('input', checkNumber);
    document.getElementById('updateButton').addEventListener('click', setExaminationFee);
})

function getExaminationFee() {
    $.ajax({
        url: "/manager/getExaminationFee",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            constant = result;
            renderExaminationFee();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function renderExaminationFee() {
    $('#examinationFee').val(constant.Value);
}

function checkNumber() {
    let val = $('#examinationFee').val();
    let number = parseInt(val);

    if (isNaN(val.trim())) {
        $('#examinationFee').css('border', 'red 1px solid');
    } else if (number < 0) {
        $('#examinationFee').css('border', 'red 1px solid');
    } else {
        $('#examinationFee').css('border', '#d1d3e2 1px solid');
    }
}

function setExaminationFee() {
    swal({
        text: "Bạn có chắc chắc muốn thay đổi chi phí của mỗi lượt khám bệnh hay không?",
        icon: "warning",
        buttons: true,
        dangerMode: true
    })
        .then((result) => {
            if (result) {
                let val = $('#examinationFee').val();
                let number = parseInt(val);

                if (isNaN(val.trim()) || number < 0 || val == '' || val == null) {
                    toastr.warning('Vui lòng điền chính xác giá trị, phí khám bệnh là một số nguyên không âm')
                } else {
                    let data = constant;
                    data.Value = number;

                    $.ajax({
                        url: "/manager/setExaminationFee",
                        data: JSON.stringify(data),
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
                }
            }
        });
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
                    <li class="nav-item active">
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