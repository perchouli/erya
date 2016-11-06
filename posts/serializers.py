from django.contrib.auth.models import User, Group
from django.utils.timesince import timesince
from rest_framework import serializers

from .models import Category, Post
from accounts.templatetags.user_tags import gravatar


from bleach import clean

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        depth = 1
        exclude = ('author',)

    content = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    author_info = serializers.SerializerMethodField()

    def get_content(self, obj):
        return clean(obj.content, strip=True)

    def get_author_info(self, obj):
        info = {}
        info['gravatar_url'] = gravatar(obj.author.email) if obj.author else ''
        info['name'] = obj.author.username
        return info

    def get_created_at(self, obj):
        return timesince(obj.created_at)

