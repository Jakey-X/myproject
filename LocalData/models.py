from django.db import models


class LocalData(models.Model):
    Date = models.DateField(auto_now_add=True, unique=True)
    Diagnosed = models.PositiveIntegerField(default=0)
    Healing = models.PositiveIntegerField(default=0)

    def __str__(self):
        return '%s' % (self.Date)
