from django.contrib.auth.models import User, Group
from django.utils.timesince import timesince
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


