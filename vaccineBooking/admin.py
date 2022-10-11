from django.contrib import admin
from vaccineBooking.models import VaccineInfo, VaccineBooking

# Register your models here.
admin.site.register([VaccineInfo, VaccineBooking])
