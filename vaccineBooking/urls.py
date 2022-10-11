from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('getinfo/', views.getinfo),
    path('getbooked/',views.getbooked),
    # path('addinfo/', views.addinfo),
    path('book/', views.book),
    path('unbook/',views.unbook),
]
