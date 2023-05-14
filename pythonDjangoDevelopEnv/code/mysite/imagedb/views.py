import hashlib

from django.shortcuts import render, get_object_or_404
from django.views.generic.list import ListView
from .forms import UploadForm
from .models import UploadImage
from django.urls import reverse_lazy
from django.views.generic.edit import DeleteView
from rest_framework import viewsets
from .models import UploadImage
from .serializers import PostSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    queryset = UploadImage.objects.all()
    serializer_class = PostSerializer

    @action(methods=['get'], detail=True)
    def get_image_hash(self, request, pk=None):
        imageurl = '.' + self.get_object().image.url
        with open(imageurl, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
        
        return Response(f'{sha256}さん')

    