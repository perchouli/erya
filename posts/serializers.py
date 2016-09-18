from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Category, Post

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category



class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post

