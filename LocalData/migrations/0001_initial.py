# Generated by Django 4.0.4 on 2022-06-06 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LocalData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Date', models.DateField(auto_now_add=True, unique=True)),
                ('Diagnosed', models.PositiveIntegerField(default=0)),
                ('Healing', models.PositiveIntegerField(default=0)),
            ],
        ),
    ]
