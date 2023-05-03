from django.urls import path

from . import views
from .views import index

app_name = 'imagedb'
urlpatterns = [
    path('', index.as_view(), name='index'),
    path(r'upload/', views.upload, name='upload'),
    path('image/<int:image_id>/', views.image, name='image'),
]