from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('getallareas/',views.getallareas),
    path('getareainfo/',views.getareainfo),
]
