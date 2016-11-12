from django.contrib.auth.models import User, Group
from django.utils.timesince import timesince
from rest_framework import serializers

from .models import Category, Post
from accounts.templatetags.user_tags import gravatar
from accounts.serializers import UserSerializer

from bleach import clean

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        depth = 1


    content = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    author = UserSerializer()
    author_info = serializers.SerializerMethodField()

    def to_internal_value(self, data):
       #TODO: validate
        return data

    def get_content(self, obj):
        return clean(obj.content, strip=True)

    def get_author_info(self, obj):
        info = {}
        if obj.author is not None:
            info['gravatar_url'] = gravatar(obj.author.email) if obj.author else ''
            info['name'] = obj.author.username
        return info

    def get_created_at(self, obj):
        return timesince(obj.created_at)

