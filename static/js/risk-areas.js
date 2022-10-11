var areas;
getareas();
function getareas() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            areas = JSON.parse(this.responseText);
            showareas(areas);
        }
    }
    xhttp.open("GET", "../risk/getallareas/", true);
    xhttp.send();
}
function showareas(data) {
    var out = "";
    if (is_auth == true) {
        for (i = 0; i < data.length; i++) {
            if (data[i].risk == 0) {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-info">低风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td><td class="align-middle text-center"><button type="button" class="btn bg-gradient-primary" style="margin-bottom:0" data-bs-toggle="modal" data-bs-target="#detail" data-bs-id=' + data[i].id + '>详情</button></td></tr>';
            }
            else if (data[i].risk == 1) {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-success">中风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td><td class="align-middle text-center"><button type="button" class="btn bg-gradient-primary" style="margin-bottom:0" data-bs-toggle="modal" data-bs-target="#detail" data-bs-id=' + data[i].id + '>详情</button></td></tr>';
            }
            else {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-warning">高风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td><td class="align-middle text-center"><button type="button" class="btn bg-gradient-primary" style="margin-bottom:0" data-bs-toggle="modal" data-bs-target="#detail" data-bs-id=' + data[i].id + '>详情</button></td></tr>';
            }
        }
    }
    else {
        for (i = 0; i < data.length; i++) {
            if (data[i].risk == 0) {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-info">低风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td></tr>';
            }
            else if (data[i].risk == 1) {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-success">中风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td></tr>';
            }
            else {
                out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].area + '</h6></div></div></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-warning">高风险</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].update_date + '</span></td></tr>';
            }
        }
    }
    document.getElementById("areasList").innerHTML = out;
}
function showdetail(id) {
    if (is_auth == false) {
        return;
    }
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var toast = document.querySelector("#ToastDiv");
            if (this.responseText != "Empty") {
                var detailinfo = JSON.parse(this.responseText);
                detail.querySelector("#area").innerHTML = detailinfo.area;
                var risk = "";
                switch (detailinfo.risk) {
                    case 0:
                        risk = "低风险";
                        break;
                    case 1:
                        risk = "中风险";
                        break;
                    case 2:
                        risk = "高风险";
                        break;
                }
                detail.querySelector("#risk").innerHTML = risk;
                detail.querySelector("#policy").innerHTML = detailinfo.policy;
            }
            else {
                toast.innerHTML = '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1000"><div id="ResultToast" class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20"xmlns="http://www.w3.org/2000/svg" aria-hidden="true"preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#ff0600"></rect></svg><strong class="me-auto">Failed</strong><small>Now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">暂无记录:-(</div></div></div>';
                toast.show();
            }
        }
    }
    xhttp.open("GET", "../risk/getareainfo/?id=" + id, true);
    xhttp.send();
}

function search() {
    if (is_auth == false) {
        return;
    }
    var area = document.querySelector("#searchArea").value;
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var toast = document.querySelector("#ToastDiv");
            if (this.responseText != "Empty") {
                var detailinfo = JSON.parse(this.responseText);
                var modal = new bootstrap.Modal(detail);
                modal.show();
                detail.querySelector("#area").innerHTML = detailinfo.area;
                var risk = "";
                switch (detailinfo.risk) {
                    case 0:
                        risk = "低风险";
                        break;
                    case 1:
                        risk = "中风险";
                        break;
                    case 2:
                        risk = "高风险";
                        break;
                }
                detail.querySelector("#risk").innerHTML = risk;
                detail.querySelector("#policy").innerHTML = detailinfo.policy;
                toast.innerHTML = '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1000"><div id="ResultToast" class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20"xmlns="http://www.w3.org/2000/svg" aria-hidden="true"preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg><strong class="me-auto">Success</strong><small>Now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">查询成功，若结果有误建议精确查找内容:-D</div></div></div>';
            }
            else {
                toast.innerHTML = '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1000"><div id="ResultToast" class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20"xmlns="http://www.w3.org/2000/svg" aria-hidden="true"preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#ff0600"></rect></svg><strong class="me-auto">Failed</strong><small>Now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">查无此记录:-(</div></div></div>';
            }
            atoast = new bootstrap.Toast(toast.querySelector("#ResultToast"));
            atoast.show();
        }
    }
    xhttp.open("GET", "../risk/getareainfo/?area=" + area, true);
    xhttp.send();
}
// 获取模态框
var detail = document.getElementById('detail')
// 触发modal时根据按钮为隐藏id赋值
detail.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    if (button != undefined) {
        var recipient = button.getAttribute('data-bs-id');
        showdetail(recipient);
    }
})