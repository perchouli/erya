from django.db import models

from django.contrib.auth.models import User

from .managers import CategoryManager

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
        return Post.objects.filter(category=self)

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

    def __str__(self):
        return self.name



class Post(models.Model):
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