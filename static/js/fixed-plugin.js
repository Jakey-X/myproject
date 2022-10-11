function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}
function checkSetting() {
    var color = getCookie("sidebarColor")
    var type = getCookie("sidebarType")
    var fixed = getCookie("isFixed")

    if (color) {
        sidebarColor(document.getElementById(color))
    }
    if (type) {
        sidebarType(document.getElementById(type))
    }
    if (fixed == "true") {
        var e = document.getElementById("navbarFixed")
        navbarFixed(e)
    }
}
function ShowFixedPlgin() {
    if (!fixedPlugin.classList.contains('show')) {
        fixedPlugin.classList.add('show');
        event.cancelBubble=true;
    } else {
        fixedPlugin.classList.remove('show');
    }
}
if (document.querySelector('.fixed-plugin')) {
    var fixedPlugin = document.querySelector('.fixed-plugin');
    var fixedPluginCard = document.querySelector('.fixed-plugin .card');
    var fixedPluginCloseButton = document.querySelectorAll('.fixed-plugin-close-button');
    var navbar = document.getElementById('navbarBlur');
    var buttonNavbarFixed = document.getElementById('navbarFixed');

    fixedPluginCloseButton.forEach(function (el) {
        el.onclick = function () {
            fixedPlugin.classList.remove('show');
        }
    })

    document.querySelector('body').onclick = function (e) {
        if (e.target != fixedPluginButton && e.target != fixedPluginButtonNav && e.target.closest('.fixed-plugin .card') != fixedPluginCard) {
            fixedPlugin.classList.remove('show');
        }
    }

    if (navbar) {
        if (navbar.getAttribute('navbar-scroll') == 'true') {
            buttonNavbarFixed.setAttribute("checked", "true");
        }
    }
}
function selectSidebarColor(e) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    sidebarColor(e)
    document.cookie = "sidebarColor=" + (e.id) + ";path=/" + ";expires=" + exp.toGMTString();
}
function selectSidebarType(e) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    sidebarType(e)
    document.cookie = "sidebarType=" + (e.id) + ";path=/" + ";expires=" + exp.toGMTString();
}
function selectFixed(e) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (e.checked) {
        document.cookie = "isFixed=" + (e.checked) + ";path=/" + ";expires=" + exp.toGMTString();
        navbarFixed(e)
    }
    else {
        document.cookie = "isFixed=false;path=/"
        navbarFixed(e)
    }
}