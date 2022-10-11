getHealthSum();
getCasesSum();
function getHealthSum() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var data = JSON.parse(this.responseText);
            // 根据当前星期构建横坐标
            var weeks = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sta"];
            var week = new Date().getDay();
            for (i = 0; i <= week; i++) {
                weeks.push(weeks.shift());
            }
            HealthSum.data.labels = weeks;
            // 填充数据，更新chart
            HealthSum.data.datasets[0].data = data.data;
            HealthSum.update();
            // 更新数据展示
            if (data.data[5] != 0) {
                if (data.data[6] >= data.data[5]) {
                    document.querySelector("#increase").innerHTML = "+" + ((data.data[6] - data.data[5]) / data.data[5] * 100).toFixed(2) + "%";
                }
                else {
                    document.querySelector("#increase").innerHTML = ((data.data[6] - data.data[5]) / data.data[5] * 100).toFixed(2) + "%";
                }
            }
            else {
                if (data.data[6] == 0) {
                    document.querySelector("#increase").innerHTML = "+" + (0).toFixed(2) + "%";
                }
                else {
                    document.querySelector("#increase").innerHTML = "+" + (100).toFixed(2) + "%";
                }
            }
            document.querySelector("#finsh").innerHTML = data.finsh * 100 + "%";
            document.querySelector("#finshbar").classList.add("w-" + data.finsh * 100);
            document.querySelector("#temphigh").innerHTML = data.temphigh * 100 + "%";
            document.querySelector("#temphighbar").classList.add("w-" + data.temphigh * 100);
        }
    }
    xhttp.open("GET", "../health/getSummary/", true);
    xhttp.send();
}
function getCasesSum() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var data = JSON.parse(this.responseText);
            // 根据当前月份构建横坐标
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            var month = new Date().getMonth();
            for (i = 0; i <= month; i++) {
                months.push(months.shift());
            }
            // 由于只显示8个月的数据，因此清除不必要的月份
            for (i = 0; i < 4; i++) {
                months.shift();
            }
            // 更新chart
            CasesSum.data.labels = months;
            CasesSum.data.datasets[0].data = data.recHealing;
            CasesSum.data.datasets[1].data = data.recDiagnosed;
            CasesSum.update();
            // 更新数据展示
            document.querySelector("#TdDiagnosed").innerHTML = data.TdDiagnosed + " 人" + '<span class="text-danger text-sm font-weight-bolder" id="DiagnosedIncrease">+0%</span>';
            if (data.YesDiagnosed > 0) {
                if (data.TdDiagnosed >= data.YesDiagnosed) {
                    document.querySelector("#DiagnosedIncrease").innerHTML = "+" + ((data.TdDiagnosed - data.YesDiagnosed) / data.YesDiagnosed * 100).toFixed(2) + "%";
                }
                else {
                    document.querySelector("#DiagnosedIncrease").innerHTML = ((data.TdDiagnosed - data.YesDiagnosed) / data.YesDiagnosed * 100).toFixed(2) + "%";
                }
            }
            else {
                if (data.TdDiagnosed == 0) {
                    document.querySelector("#DiagnosedIncrease").innerHTML = "+" + (0).toFixed(2) + "%";
                }
                else {
                    document.querySelector("#DiagnosedIncrease").innerHTML = "+" + (100).toFixed(2) + "%";
                }
            }
            document.querySelector("#DiagnosedNow").innerHTML = data.SumDiagnosed - data.SumHealing + " 人";
            document.querySelector("#SumDiagnosed").innerHTML = data.SumDiagnosed + " 人";
            document.querySelector("#SumHealing").innerHTML = data.SumHealing + " 人";
            if (data.recDiagnosed[6] != 0) {
                if (data.recDiagnosed[6] > data.recDiagnosed[5]) {
                    document.querySelector("#monthIncrease").innerHTML = 'This month is ' + "+" + ((data.recDiagnosed[6] - data.recDiagnosed[5]) / data.recDiagnosed[5] * 100).toFixed(2) + "%" + " more";
                }
                else {
                    document.querySelector("#monthIncrease").innerHTML = 'This month is ' + ((data.recDiagnosed[6] - data.recDiagnosed[5]) / data.recDiagnosed[5] * 100).toFixed(2) + "%" + " more";
                }
            }
            else {
                document.querySelector("#monthIncrease").innerHTML = 'This month is ' + "+" + (100).toFixed(2) + "%" + " more";
            }
        }
    }
    xhttp.open("GET", "../localdata/getSummary", true);
    xhttp.send();
}