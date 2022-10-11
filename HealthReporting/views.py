from datetime import datetime, timedelta

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Count
from django.http import JsonResponse
from django.shortcuts import render

from HealthReporting.models import HealthReport


@login_required
def index(request):
    if request.method == "GET":
        return render(request, 'health.html')
    else:
        user = request.user
        position = request.POST.get("position")
        tempHigh = request.POST.get("tempHigh")
        healthCode = request.POST.get("HealthCode")
        strokeCode = request.POST.get("StrokeCode")
        vaccine = request.POST.get("Vaccine")
        symptom = request.POST.get("Symptom")
        # 首先判断今日此用户是否已上报，不应直接get_or_create
        if HealthReport.objects.filter(user=user, report_date=datetime.today()).exists():
            return render(request, 'health.html', {"ErrMsg": "今日已上报~"})
        else:
            # 判断表单数据是否合法
            if isinstance(position, str) and tempHigh in ('True', 'False') and int(healthCode) in (0, 1, 2) and strokeCode in ('True', 'False') and int(vaccine) in (0, 1, 2, 3) and symptom in ('True', 'False'):
                report, flag = HealthReport.objects.get_or_create(
                    user=user, position=position, tempHigh=tempHigh, healthCode=healthCode, strokeCode=strokeCode, vaccine=vaccine, symptom=symptom)
                if flag:
                    return render(request, 'health.html', {"Msg": "GJ! 上报成功"})
                else:
                    return render(request, 'health.html', {"ErrMsg": "Yes??"})
            else:
                return render(request, 'health.html', {"ErrMsg": "提交数据有误！"})


def getSummary(request):
    # 统计用户总数
    allUser = User.objects.all().count()
    today = datetime.today()
    weekdelta = datetime.today() - timedelta(weeks=1)
    # 获得最近一周的QuerySet
    LastWeek = HealthReport.objects.filter(
        report_date__gte=weekdelta, report_date__lte=today)
    # 获得今日QuerySet
    todayData = LastWeek.filter(report_date=today)
    # 统计今日记录数
    ctodayData = todayData.count()
    # 计算今日体温过高记录数
    todayTemphigh = todayData.filter(tempHigh=True).count()
    # 计算体温过高人数占比
    if todayTemphigh == 0:
        temphigh = 0
    else:
        temphigh = todayTemphigh/ctodayData
    # groupby获取每日记录数
    dataPerday = LastWeek.values('report_date').annotate(
        PerDay=Count('user')).values('report_date', 'PerDay')
    data = [0, 0, 0, 0, 0, 0, 0]
    for i in dataPerday:
        # if i.get('report_date')==today:
        #     data[6]=i.get('PerDay')
        # else:
        data[7-(today.date()-i.get('report_date')).days-1] = i.get('PerDay')
    data_list = list(data)
    # 计算完成度
    if ctodayData == 0:
        finsh = 0
        data_list.append(0)
    else:
        finsh = ctodayData/allUser
    # 启动初期数据不足时做0填充
    if len(data_list) < 7:
        data_fill = []
        for i in range(7-len(data_list)):
            data_fill.append(0)
        data = data_fill+data_list
    # 构建返回数据字典
    Rdata = {
        'data': data,
        'finsh': finsh,
        'temphigh': temphigh
    }
    return JsonResponse(Rdata, safe=False)
