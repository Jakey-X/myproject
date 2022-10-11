// TODO:全面更换为jQuery实现
var vaccinesinfo;
// 首先执行获取全部疫苗信息
getinfo();
function getinfo() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            vaccinesinfo = JSON.parse(this.responseText);
            showinfo(vaccinesinfo);
        }
    }
    xhttp.open("GET", "../vaccine/getinfo/", true);
    xhttp.send();
}
// 展示数据 data:JSON
function showinfo(data) {
    var out = "";
    for (i = 0; i < data.length; i++) {
        var status = data[i].left > 0 ? "Available" : "Unavailable"
        // var plan = new Date(Date.parse(data[i].vaccination_dates));
        // var now = new Date();
        // if (now <= plan) {
        if (status == "Available") {
            out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].provider + '</h6></div></div></td><td><p class="text-xs font-weight-bold mb-0">' + data[i].total + '</p></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-success">Available</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].vaccination_dates + '</span></td><td class="align-middle text-center"><button type="button" class="btn bg-gradient-primary" style="margin-bottom:0" data-bs-toggle="modal" data-bs-target="#bookVer" data-bs-id=' + data[i].batch_id + '>预约</button></td></tr>';
        }
        else {
            out += '<tr><td><div class="d-flex px-2 py-1"><div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">' + data[i].provider + '</h6></div></div></td><td><p class="text-xs font-weight-bold mb-0">' + data[i].total + '</p></td><td class="align-middle text-center text-sm"><span class="badge badge-sm bg-gradient-warning">Unavailable</span></td><td class="align-middle text-center"><span class="text-secondary text-xs font-weight-bold">' + data[i].vaccination_dates + '</span></td><td class="align-middle text-center"><button type="button" class="btn bg-gradient-secondary" style="margin-bottom:0" disabled>预约</a></td></tr>';
        }
        // }
    }
    document.getElementById("vaccineinfo").innerHTML = out;
}
// 预约疫苗
function book() {
    var captcha = document.getElementById("captcha").value;
    var out = "";
    var outh = '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1000"><div id="BookToast" class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20"xmlns="http://www.w3.org/2000/svg" aria-hidden="true"preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#ff0600"></rect></svg><strong class="me-auto">Failed</strong><small>Now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">'
    var outt = '</div></div></div>'
    if (captcha.length == 5) {
        var xhttp;
        var csrftoken = getCookie("csrftoken");
        var batch_id = id.value;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                if (this.responseText == "BookDone") {
                    out = '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1000"><div id="BookToast" class="toast fade hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20"xmlns="http://www.w3.org/2000/svg" aria-hidden="true"preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg><strong class="me-auto">Success</strong><small>Now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">预约成功！:-D</div></div></div>'
                }
                else if (this.responseText == "Overdue") {
                    out = outh + '预约失败，疫苗已过期:-(' + outt;
                }
                else if (this.responseText == "ExistErr") {
                    out = outh + '预约失败！您已预约此疫苗:-(' + outt;
                }
                else if (this.responseText == "RunOut") {
                    out = outh + '预约失败！疫苗不足:-(' + outt;
                }
                else if (this.responseText == "CaptchaErr") {
                    out = outh + '预约失败！验证码错误:-(' + outt;
                }
            }
            else if (xhttp.readyState == 4 && xhttp.status == 403) {
                out = outh + '预约失败！身份认证错误:-(' + outt;
            }
            panel = document.getElementById("ToastDiv");
            panel.innerHTML = out;
            var toast = new bootstrap.Toast(panel.querySelector("#BookToast"));
            if (toast._element != undefined) {
                // new bootstrap.Modal似乎会导致重新生成Modal对象，因此使用getInstance
                var modalEle = document.getElementById("bookVer");
                modalEle.querySelector(".captcha").src = "/captcha/" + '?' + Math.random();
                var modal = bootstrap.Modal.getInstance(modalEle);
                modal.hide();
                toast.show();
            }
        }
        xhttp.open("POST", "../vaccine/book/", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("csrfmiddlewaretoken=" + csrftoken + "&captcha=" + captcha + "&batch_id=" + batch_id);
    }
}

// 获取模态框
var bookVer = document.getElementById('bookVer')
// 获取模态框内隐藏id
var id = bookVer.querySelector('#batch_id')
// 触发modal时根据按钮为隐藏id赋值
bookVer.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget
    var recipient = button.getAttribute('data-bs-id')
    id.value = recipient
})