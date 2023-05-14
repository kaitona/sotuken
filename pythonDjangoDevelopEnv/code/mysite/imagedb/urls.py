from django.urls import path, include
from rest_framework import routers


from . import views

app_name = 'imagedb'
router = routers.DefaultRouter()
router.register('post',views.PostViewSet)
urlpatterns = [
    path('', include(router.urls)),
]