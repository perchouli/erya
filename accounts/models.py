# encoding: utf8
from django.db import models

from django.contrib.auth.models import User
from threads.models import Thread, Post


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

    def count(self):
        return {
            'post': Post.objects.filter(author=self.user).count(),
            'thread': Thread.objects.filter(author=self.user).count(),
        }

    def is_student(self):
        return True if Student.objects.filter(user=self.user).count() else False

def create_user_profile(sender=None, instance=None, created=False, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)
        userprofile.save()
models.signals.post_save.connect(create_user_profile, sender=User)
