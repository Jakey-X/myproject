import re
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required


def redirectindex(request):
    return redirect('localdata/')


@login_required
def profile(request):
    if request.method == 'GET':
        return render(request, 'profile.html')
    elif request.method == 'POST':
        user = request.user
        old_pwd = request.POST.get('oldpwd')
        new_pwd = request.POST.get('newpwd')
        if len(old_pwd) >= 8 and len(new_pwd) >= 8:
            if user.check_password(old_pwd):
                user.set_password(new_pwd)
                user.save()
                update_session_auth_hash(request, user)
                return redirect('../login/')
            else:
                return render(request, 'profile.html', {'Msg': '原密码错误'})
        else:
            return render(request, 'profile.html', {'Msg': '密码长度有误'})


def log_in(request):
    if request.method == "GET":
        return render(request, 'login.html')
    username = request.POST.get("username")
    password = request.POST.get("password")
    captcha = request.POST.get("captcha")
    if captcha.lower() == request.session.get('verify_code'):
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            path = request.GET.get("next") or "/"
            return redirect(path)
        else:
            return render(request, 'login.html', {'ErrMsg': 'Username or password mismatch'})
    else:
        return render(request, 'login.html', {"ErrMsg": 'Captcha mismatch'})


def log_out(request):
    logout(request)
    return redirect('/')


def register(request):
    if request.method == "GET":
        return render(request, 'register.html')
    username = request.POST.get("username")
    email = request.POST.get("email", "")
    flag = re.match(r'^([a-zA-Z0-9\.]+)@([a-zA-Z0-9\.]+)$', email)
    password = request.POST.get("password")
    captcha = request.POST.get("captcha")
    # 后台输入验证
    if username is None or flag is None or password is None or len(password) < 8 or captcha is None:
        return render(request, 'register.html', {"ErrMsg": "DON'T EVEN THINK ABOUT IT...-_-"})
    # 后台执行验证
    if captcha.lower() == request.session.get('verify_code'):
        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    username=username, email=email, password=password)
                return redirect('/login/')
            else:
                return render(request, 'register.html', {"ErrMsg": 'Email Already Exist'})
        else:
            return render(request, 'register.html', {"ErrMsg": 'Username Already Exist'})
    else:
        return render(request, 'register.html', {"ErrMsg": 'Captcha mismatch'})
