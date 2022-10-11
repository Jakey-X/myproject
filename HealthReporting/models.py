from django.db import models
from django.contrib.auth.models import User


class HealthReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    report_date = models.DateField(auto_now_add=True)
    position = models.CharField(max_length=80)
    tempHigh = models.BooleanField(default=False)
    healthCode = models.IntegerField(default=0)
    strokeCode = models.BooleanField(default=False)
    vaccine = models.IntegerField(default=0)
    symptom = models.BooleanField(default=False)
    def __str__(self):
        return '%s %s' % (self.report_date,self.user)