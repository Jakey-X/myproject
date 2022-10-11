from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from RiskAreas.models import RiskAreas


def index(request):
    return render(request, 'risk.html')


def getallareas(request):
    allareas = RiskAreas.objects.all()
    Rdata = []
    if allareas:
        for i in allareas:
            data = {
                'id': i.id,
                'risk': i.risk,
                'area': i.area,
                'update_date': i.update_date,
            }
            Rdata.append(data)
    return JsonResponse(Rdata, safe=False)


@login_required
def getareainfo(request):
    id = request.GET.get('id')
    area = request.GET.get('area')
    if id is not None:
        detail = RiskAreas.objects.filter(pk=id)
    elif area is not None:
        detail = RiskAreas.objects.filter(area__contains=area)
    if detail.exists():
        return JsonResponse(detail.values()[0], safe=False)
    else:
        return HttpResponse("Empty")
