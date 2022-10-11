from datetime import datetime

from django.contrib.auth.decorators import login_required
# from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from vaccineBooking.models import VaccineBooking, VaccineInfo


@login_required
def index(request):
    return render(request, 'vaccine.html')


@login_required
def getinfo(request):
    today=datetime.today()
    vaccine = VaccineInfo.objects.all().filter(vaccination_dates__gte=today)
    # data = list(vaccine)
    vaccines = []
    if vaccine:
        for i in vaccine:
            data = {
                'batch_id': i.batch_id,
                'provider': i.provider,
                'total': i.total,
                'left': i.left,
                'vaccination_dates': i.vaccination_dates
            }
            vaccines.append(data)
    # data_dist = {
    #     vaccines,
    #     }
    # return HttpResponse(json.dumps(data_dist), content_type="application/json")
    return JsonResponse(vaccines, safe=False)


@login_required
def getbooked(request):
    booked = VaccineBooking.objects.filter(user=request.user).all()
    bookeds = []
    if booked:
        for i in booked:
            vaccineInfo = i.vaccine
            if vaccineInfo:
                data = {
                    'id': i.id,
                    'provider': vaccineInfo.provider,
                    'vaccination_dates': vaccineInfo.vaccination_dates,
                }
            bookeds.append(data)
    return JsonResponse(bookeds, safe=False)


@login_required
def addinfo(request):
    provider = request.POST.get('provider')
    total = request.POST.get('total')
    left = request.POST.get('left')
    vaccination_dates = request.POST.get('vaccination_dates')
    vaccine = VaccineInfo.objects.create(
        provider=provider, total=total, left=left, vaccination_dates=vaccination_dates)


@login_required
def book(request):
    if request.POST.get('captcha').lower() == request.session.get('verify_code'):
        user = request.user
        batch_id = request.POST.get('batch_id')
        vaccine = VaccineInfo.objects.filter(pk=batch_id).first()
        if vaccine.left > 0:
            if vaccine.vaccination_dates >= datetime.today().date():
                booking, flag = VaccineBooking.objects.get_or_create(
                    vaccine=vaccine,
                    user=user,
                )
                vaccine.left -= 1
                vaccine.save()
                if flag:
                    return HttpResponse("BookDone")
                else:
                    return HttpResponse("ExistErr")
            else:
                return HttpResponse("Overdue")
        else:
            return HttpResponse("RunOut")
    else:
        return HttpResponse("CaptchaErr")


@login_required
def unbook(request):
    if request.POST.get('captcha').lower() == request.session.get('verify_code'):
        user = request.user
        id = request.POST.get('id')
        vaccine = VaccineBooking.objects.filter(pk=id,user=user)
        if vaccine.exists():
            vaccineinfo = vaccine.first().vaccine
            if vaccineinfo.vaccination_dates > datetime.today().date():
                vaccineinfo.left += 1
                vaccineinfo.save()
                vaccine.delete()
                return HttpResponse("UnBookDone")
            else:
                return HttpResponse("Overdue")
        else:
            return HttpResponse("UnExistErr")
    else:
        return HttpResponse("CaptchaErr")
