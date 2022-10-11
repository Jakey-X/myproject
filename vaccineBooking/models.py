from django.db import models
from django.contrib.auth.models import User


class VaccineInfo(models.Model):
    batch_id = models.AutoField(primary_key=True)
    provider = models.CharField(max_length=50)
    total = models.PositiveIntegerField(default=0)
    left = models.PositiveIntegerField(default=0)
    vaccination_dates = models.DateField()
    users = models.ManyToManyField(User, through='VaccineBooking')
    def __str__(self):
        return '%s %s %s' % (self.batch_id,self.provider,self.vaccination_dates)


class VaccineBooking(models.Model):
    vaccine = models.ForeignKey(VaccineInfo, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_date = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return '%s %s' % (self.batch_id,self.user)