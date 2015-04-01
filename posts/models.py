# encoding: utf8
from django.apps import AppConfig
from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

from .managers import PostManager

from actstream import registry, action

import re

class Category(models.Model):
    name = models.CharField(max_length=32)
    sort = models.IntegerField(max_length=8)
    icon = models.CharField(max_length=16, blank=True)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    def posts(self):
        return Post.objects.approved().filter(category=self).order_by('-created_at')[:3]

class CategoryTag(models.Model):
    COLOR_CHOICES = (
        ('red', '红色'),
        ('blue', '蓝色'),
        ('green', '绿色'),
        ('purpel', '紫色'),
        ('black', '黑色'),
    )
    name = models.CharField(max_length=32)
    category = models.ForeignKey(Category)
    color = models.CharField(max_length=48, choices=COLOR_CHOICES, default='success')
    sort = models.IntegerField(max_length=8)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

class Post(models.Model):
    STATUS_REVIEW = 'review'
    STATUS_APPROVED = 'approved'
    STATUS_REJECTED = 'rejected'
    STATUS_REMOVED = 'removed'
    STATUS_EXPIRED = 'expired'

    STATUS_CHOICES = (
        (STATUS_REVIEW, '待审核'),
        (STATUS_APPROVED, '已发布'),
        (STATUS_REJECTED, '已拒绝'),
        (STATUS_REMOVED, '已删除'),
        (STATUS_EXPIRED, '已过期'),
    )
    objects = PostManager()
    title = models.CharField(max_length=48)
    category = models.ForeignKey(Category)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
    content = models.TextField()
    tag = models.ForeignKey(CategoryTag, max_length=64, blank=True, null=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_APPROVED, db_index=True)
    author = models.ForeignKey(User, null=True)
    reply = models.DateTimeField(auto_now_add=True)
    pageviews = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)

    focus = models.BooleanField(default=False)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def count(self):
        return {
            'reply': Reply.objects.filter(post=self).count(),
        }

    def latest_reply(self):
        return Reply.objects.filter(post=self).latest('created_at')


class Reply(models.Model):
    post = models.ForeignKey(Post, related_name='post')
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
    author = models.ForeignKey(User)
    content = models.TextField()

    def __unicode__(self):
        return self.post.title

    def __str__(self):
        return self.post.title

def reply_notice(sender, instance, created, **kwargs):
    if instance.post.author != instance.author:
        action.send(instance.post.author, verb='receive', action_object=instance, target=instance.post)

    at_username = re.search('<span\ style="color:#638911">@(\S+)</span>', instance.content)
    if at_username:
        username = at_username.group(1).strip()
        user = User.objects.get(username=username)
        if user != instance.author:
            action.send(user, verb='reminded', action_object=instance, target=instance.post)
post_save.connect(reply_notice, sender=Reply)

def get_file_path(model, file_name):
    return '%d/%s' % (model.user.id, file_name)
class Attachment(models.Model):
    user = models.ForeignKey(User)
    src = models.ImageField(upload_to=get_file_path)
