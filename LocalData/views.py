from datetime import datetime, timedelta

from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.shortcuts import render

from LocalData.models import LocalData


def index(request):
    return render(request, 'local.html')


def getSummary(request):
    # 获取今昨日期
    today = datetime.today()
    yestoday = today-timedelta(days=1)
    # 获取今昨记录
    TdData = LocalData.objects.filter(Date=today)
    YesData = LocalData.objects.filter(Date=yestoday)
    # 判断是否存在
    if TdData.exists():
        TdDiagnosed = TdData.values_list('Diagnosed', flat=True)[0]
    else:
        TdDiagnosed = 0
    if YesData.exists():
        YesDiagnosed = YesData.values_list('Diagnosed', flat=True)[0]
    else:
        YesDiagnosed = 0
    # 统计所有记录中确诊数总和
    allLocalData = LocalData.objects.all()
    SumDiagnosed = allLocalData.aggregate(
        SumDiagnosed=Sum('Diagnosed')).get('SumDiagnosed')
    # 统计所有记录中治愈数总和
    SumHealing = allLocalData.aggregate(
        SumHealing=Sum('Healing')).get('SumHealing')
    # 确定8个月前到本月范围
    month_now = today.month
    if today.month >= 8:
        month_rec = (datetime.today().month-8+12) % 12
        recentData = LocalData.objects.filter(
            Date__month__gte=month_rec, Date__month__lte=month_now)
    else:
        month_rec = datetime(today.year-1, 12+today.month-8+1, 1)
        recentData = LocalData.objects.filter(
            Date__gte=month_rec, Date__lte=today)
    # 统计近8个月内各个月确诊数与治愈数
    recDiagnosed = recentData.annotate(month=TruncMonth('Date')).values('month').annotate(
        SumDiagonsed=Sum('Diagnosed')).values('SumDiagonsed', 'month')
    recHealing = recentData.annotate(month=TruncMonth('Date')).values('month').annotate(
        SumHealing=Sum('Healing')).values('SumHealing', 'month')
    # 准确得到数据（对比下面一种方案
    data_recDiagnosed = [0, 0, 0, 0, 0, 0, 0, 0]
    data_recHealing = [0, 0, 0, 0, 0, 0, 0, 0]
    for i in recDiagnosed:
        if i.get('month').month == today.month:
            data_recDiagnosed[7] = i.get('SumDiagonsed')
        elif today.month > i.get('month').month:
            data_recDiagnosed[7-(today.month - i.get('month').month)
                              ] = i.get('SumDiagonsed')
        else:
            data_recDiagnosed[(8-today.month+i.get('month').month-1) %
                              12] = i.get('SumDiagonsed')
    for i in recHealing:
        if i.get('month').month == today.month:
            data_recHealing[7] = i.get('SumHealing')
        elif today.month > i.get('month').month:
            data_recHealing[7-(today.month - i.get('month').month)
                            ] = i.get('SumHealing')
        else:
            data_recHealing[(8-today.month+i.get('month').month-1) %
                            12] = i.get('SumHealing')
    # 下面这种填充方法对于中间数据为空的月份不合理
    # 启动初期数据不足时做0填充
    # if len(recDiagnosed) < 8:
    #     data_fill = []
    #     for i in range(8-len(recDiagnosed)):
    #         data_fill.append(0)
    #     data_recDiagnosed = data_fill+list(recDiagnosed)
    #     data_recHealing = data_fill+list(recHealing)
    # 构建返回数据
    RData = {
        'TdDiagnosed': TdDiagnosed,
        'YesDiagnosed': YesDiagnosed,
        'SumDiagnosed': SumDiagnosed,
        'SumHealing': SumHealing,
        'recDiagnosed': data_recDiagnosed,
        'recHealing': data_recHealing
    }
    return JsonResponse(RData, safe=False)
