# Generated by Django 4.0.4 on 2022-06-06 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RiskAreas',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('risk', models.PositiveSmallIntegerField(default=0)),
                ('area', models.CharField(max_length=50, unique=True)),
                ('policy', models.TextField()),
                ('update_date', models.DateField(auto_now=True)),
            ],
        ),
    ]
