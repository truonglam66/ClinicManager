let thisMonth, thisYear;
let patients, healthRecords;

var yearAreaChartJs;
var dataAreaChartOfYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var yearPieChartJs;
var dataPieChartOfYear = [0, 0];

var monthAreaChartJs;
var labelAreaChartOfMonth = [];
var dataAreaChartOfMonth = [];
var monthPieChartJs;
var dataPieChartOfMonth = [0, 0];

$(document).ready(function () {
    renderSidebar();
    getNow();
    $('#inputYear').val(thisYear);
    $('#inputMonth').val(thisMonth);
    getPatients();
});

function getNow() {
    let d = Date.now();
    d = new Date(d);
    thisMonth = d.getMonth() + 1;
    thisYear = d.getFullYear();
}

function selectYear() {
    let healthRecordOfSelectedYear = getDataByYear($('#inputYear').val());
    dataAreaChartOfYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dataPieChartOfYear = [0, 0];
    healthRecordOfSelectedYear.forEach(element => {
        let month = element.CreateAt.m;
        dataAreaChartOfYear[month - 1] += element.ExaminationFee;
        if (element.IsReExamination) {
            dataPieChartOfYear[1]++;
        } else {
            dataPieChartOfYear[0]++;
        }
    });
    yearAreaChartJs.destroy();
    renderAreaChartOfYear();
    yearPieChartJs.destroy();
    renderPieChartOfYear();
    renderYearInfo();
    selectMonth();
}

function selectMonth() {
    let y = $('#inputYear').val();
    let m = $('#inputMonth').val();
    let daysInMonth = new Date(y, m, 0).getDate();

    labelAreaChartOfMonth = [];
    dataAreaChartOfMonth = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
        labelAreaChartOfMonth.push(i);
        dataAreaChartOfMonth.push(0);
    }

    let healthRecordOfSelectedMonth = getDataByMonth($('#inputMonth').val());
    dataPieChartOfMonth = [0, 0];
    healthRecordOfSelectedMonth.forEach(element => {
        let date = element.CreateAt.d;
        dataAreaChartOfMonth[date - 1] += element.ExaminationFee;
        if (element.IsReExamination) {
            dataPieChartOfMonth[1]++;
        } else {
            dataPieChartOfMonth[0]++;
        }
    });
    monthPieChartJs.destroy();
    renderPieChartOfMonth();
    monthAreaChartJs.destroy();
    renderAreaChartOfMonth();
    renderMonthInfo();
}

function getDataByYear(year) {
    let selectedYear = year;
    let output = healthRecords.filter(function (item) {
        return item.CreateAt.y == selectedYear;
    });
    return output;
}

function getDataByMonth(month) {
    let selectedMonth = month;
    let selectedYear = $('#inputYear').val();
    let output = healthRecords.filter(function (item) {
        return (item.CreateAt.y == selectedYear && item.CreateAt.m == selectedMonth);
    });
    return output;
}

function getPatients() {
    $.ajax({
        url: "/community/getPatients",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            patients = result;
            patients = patients.map(function(item){
                item.CreateAt = convertCSharpDateToDateObj(item.CreateAt);
                return item;
            })
            console.log(patients);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
        complete: function () {
            getHealthRecords();
        }
    });
}

function getHealthRecords() {
    $.ajax({
        url: "/community/getHealthRecords",
        type: "GET",
        contentType: "application/json;charset=utf-8",
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
            alert(errormessage.responseText);
        },
        complete: function () {
            renderYearInfo();
            renderMonthInfo();
            renderAreaChartOfYear();
            renderPieChartOfYear();
            renderAreaChartOfMonth();
            renderPieChartOfMonth();
            selectYear();
            selectMonth();
        }
    });
}

function renderYearInfo() {
    let year = $('#inputYear').val();
    let patientOfYear = patients.filter(function(item) {
        return item.CreateAt.y == year;
    })
    $('#totalPatientOfYear').html(patientOfYear.length);
    let healthRecordOfYear = healthRecords.filter(function(item) {
        return item.CreateAt.y == year;
    })
    $('#totalHealthRecordOfYear').html(healthRecordOfYear.length);
    let sum = 0;
    $.each(healthRecordOfYear, function () { sum += parseFloat(this.ExaminationFee) || 0; });
    $('#totalRevenueOfYear').html(sum);
}

function renderMonthInfo() {
    let year = $('#inputYear').val();
    let month = $('#inputMonth').val();
    let patientOfMonth = patients.filter(function(item) {
        return (item.CreateAt.y == year && item.CreateAt.m == month);
    })
    $('#totalPatientOfMonth').html(patientOfMonth.length);
    let healthRecordOfMonth = healthRecords.filter(function(item) {
        return (item.CreateAt.y == year && item.CreateAt.m == month);
    })
    $('#totalHealthRecordOfMonth').html(healthRecordOfMonth.length);
    let sum = 0;
    $.each(healthRecordOfMonth, function () { sum += parseFloat(this.ExaminationFee) || 0; });
    $('#totalRevenueOfMonth').html(sum);
}

function renderAreaChartOfYear() {
    var ctx = document.getElementById("yearAreaChart");
    yearAreaChartJs = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            datasets: [{
                label: "Doanh thu",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: dataAreaChartOfYear,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return number_format(value);
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    }
                }
            }
        }
    });
}

function renderPieChartOfYear() {
    let ctx = document.getElementById("yearPieChart");
    yearPieChartJs = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Khám mới", "Tái khám"],
            datasets: [{
                data: dataPieChartOfYear,
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}

function renderAreaChartOfMonth() {
    var ctx = document.getElementById("monthAreaChart");
    monthAreaChartJs = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelAreaChartOfMonth,
            datasets: [{
                label: "Doanh thu",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: dataAreaChartOfMonth,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return number_format(value);
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    }
                }
            }
        }
    });
}

function renderPieChartOfMonth() {
    let ctx = document.getElementById("monthPieChart");
    monthPieChartJs = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Khám mới", "Tái khám"],
            datasets: [{
                data: dataPieChartOfMonth,
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },
    });
}

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
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