# encoding: utf8
from django.db import models

from django.contrib.auth.models import User
from posts.models import Post


class UserProfile(models.Model):
    """
    用户信息
    """
    user = models.OneToOneField(User, related_name='profile')
    money = models.IntegerField(default=0)
    credit = models.IntegerField(default=0)
    gender = models.IntegerField(default=0)
    avatar = models.CharField(max_length=64, blank=True, null=True)

    def __unicode__(self):
        return self.user.username

def create_user_profile(sender=None, instance=None, created=False, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)
        userprofile.save()
models.signals.post_save.connect(create_user_profile, sender=User)
