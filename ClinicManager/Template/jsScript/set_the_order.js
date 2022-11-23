let missCalls = [];
let dataTable = [];

$(document).ready(function () {
    if (account.Role != 2) {
        window.location.href = '/page_not_found';
    }
    renderSidebar();
    getMissCalls();
    console.log('ready');
});

function getMissCalls() {
    $.ajax({
        url: "/home/getMissCalls",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            missCalls = [];
            missCalls = result;
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            renderMissCalls();
        }
    });
}

function renderMissCalls() {
    dataTable = generateDataOfTable(missCalls);
    $('#dataTable').DataTable().destroy();
    $('#dataTable').DataTable({
        data: dataTable
    });
}

function generateDataOfTable(input) {
    output = [];
    for (let item of input) {
        let itemTmp = [];

        itemTmp.push(item.IndexOfDay);
        itemTmp.push(item.Patient_Name);
        itemTmp.push('<button class="text-xs btn btn-primary" onclick="return setTheOrderbyId(' + item.IdHealthRecord + ')">Cập nhật</button>');

        output.push(itemTmp);
    }

    return output;
}

function setTheOrderbyId(id) {
    let missCall = missCalls.find(x => x.IdHealthRecord == id);
    swal({
        text: "Bạn có chắc chắn muốn đưa phiếu khám có số thứ tự " + missCall.IndexOfDay + " vào hàng đợi hay không?",
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
                        console.log(result);
                        toastr.success('Cập nhật thành công');
                        getMissCalls();
                    },
                    error: function (errormessage) {
                        toastr.error('Cập nhật thất bại');
                    }
                });
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
                    <li class="nav-item active">
                        <a class="nav-link" href="/receptionist/set_the_order">
                            <i class="fas fa-fw fa-list-ol"></i>
                            <span>Cập nhật thứ tự</span></a>
                    </li>
        `
    }

    $('#sidebarReceptionist').html(content);
}