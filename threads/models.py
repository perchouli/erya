from django.db import models

from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=32)
    sort = models.IntegerField(max_length=8)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.name

class CategoryTag(models.Model):
    COLOR_CHOICES = (
        ('red', u'红色'),
        ('blue', u'蓝色'),
        ('green', u'绿色'),
        ('purpel', u'紫色'),
        ('black', u'黑色'),
    )
    name = models.CharField(max_length=32)
    category = models.ForeignKey(Category)
    color = models.CharField(max_length=48, choices=COLOR_CHOICES, default='success')
    description = models.TextField(blank=True)
    sort = models.IntegerField(max_length=8, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        ordering = ['sort']


class Thread(models.Model):
    title = models.CharField(max_length=48)
    category = models.ForeignKey(Category)
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
    content = models.TextField()
    tag = models.ForeignKey(CategoryTag, max_length=64, blank=True, null=True)
    close = models.BooleanField(default=False)
    author = models.ForeignKey(User, null=True)
    reply = models.DateTimeField(auto_now_add=True)
    pageviews = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)

    focus = models.BooleanField(default=False)

    def __unicode__(self):
        return self.title


class Post(models.Model):
    thread = models.ForeignKey(Thread, related_name='thread')
    created_at = models.DateTimeField(auto_now_add=True, editable=True)
    author = models.ForeignKey(User)
    content = models.TextField()
