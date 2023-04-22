from django.urls import path

from . import views

app_name = 'imagedb'
urlpatterns = [
    path('', views.index, name='index'),
    path(r'upload/', views.upload, name='upload'),
]