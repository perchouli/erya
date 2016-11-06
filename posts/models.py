# encoding: utf8
from django.apps import AppConfig
from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

from .managers import PostManager

from actstream import registry, action

import re

class Category(models.Model):
    COLOR_CHOICES = (
        ('red', '红色'),
        ('blue', '蓝色'),
        ('green', '绿色'),
        ('purpel', '紫色'),
        ('black', '黑色'),
    )
    name = models.CharField(max_length=32)
    sort = models.IntegerField(null=True, blank=True)
    icon = models.CharField(max_length=16, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('Category', null=True, blank=True)
    color = models.CharField(max_length=48, choices=COLOR_CHOICES, null=True, blank=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    def latest_post(self):
        return Post.objects.approved().filter(category=self).latest('created_at')

    def num_posts(self):
        return Post.objects.filter(category=self).count()


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
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_APPROVED, db_index=True)
    author = models.ForeignKey(User, null=True)
    reply = models.DateTimeField(auto_now_add=True)
    pageviews = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    parent = models.ForeignKey('self', null=True, blank=True)

    focus = models.BooleanField(default=False)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def count(self):
        return {

        }

    def latest_reply(self):
        return Post.objects.filter(parent=self).latest('created_at')

    def get_absolute_url(self):
        from django.core.urlresolvers import reverse
        return reverse('posts.views.post_detail', args=[str(self.id)])


def get_file_path(model, file_name):
    return '%d/%s' % (model.user.id, file_name)
class Attachment(models.Model):
    user = models.ForeignKey(User)
    src = models.FileField(upload_to=get_file_path)
