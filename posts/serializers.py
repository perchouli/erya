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

    content = serializers.SerializerMethodField()
    author_gravatar = serializers.SerializerMethodField()
    author = serializers.StringRelatedField(read_only=True)
    created_at = serializers.SerializerMethodField()


    def get_content(self, obj):
        return clean(obj.content, strip=True)

    def get_author_gravatar(self, obj):
        return gravatar(obj.author.email)

    def get_created_at(self, obj):
        return timesince(obj.created_at)
