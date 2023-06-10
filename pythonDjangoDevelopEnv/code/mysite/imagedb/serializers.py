from rest_framework import serializers
from .models import UploadImage

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadImage
        fields = ('id', 'title', 'description', 'image', 'image_hash')