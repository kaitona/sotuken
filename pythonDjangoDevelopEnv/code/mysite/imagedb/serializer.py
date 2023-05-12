from rest_framework import serializers
from backend import models
from backend.models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title','text','created_at','updated_at','id')
        read_only_fields = ('id',)