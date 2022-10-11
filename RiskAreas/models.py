from django.db import models


class RiskAreas(models.Model):
    risk = models.PositiveSmallIntegerField(default=0)
    area = models.CharField(max_length=50, unique=True)
    policy = models.TextField()
    update_date = models.DateField(auto_now=True)

    def __str__(self):
        return '%s' % (self.area)
