# coding: utf-8
from django.core.paginator import Paginator
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils import timesince

from .models import Category, Post, Attachment
from .serializers import PostSerializer, CategorySerializer
from accounts.templatetags.user_tags import gravatar

import django_filters
from actstream.models import Action
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.exceptions import APIException
import random
import datetime
import json
import bleach


class UnauthorizedException(APIException):
    status_code = 403
    default_detail = 'Please login'


class PostFilter(filters.FilterSet):
    parent_isnull = django_filters.BooleanFilter(name='parent', lookup_type='isnull')
    class Meta:
        model = Post
        fields = ('id', 'author', 'category', 'parent')

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PostFilter

    def create(self, request):
        if not request.user.is_authenticated():
            raise UnauthorizedException
        data = request.data.dict()
        data['author'] = request.user.id
        serializer = PostSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors)
        serializer.save()

        post = serializer.instance
        post = PostSerializer(post)
        return Response(post.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('-sort')
    serializer_class = CategorySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('parent', )


def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    post.pageviews = post.pageviews + 1
    post.save()

    if request.user:
        notices = Action.objects.filter(actor_object_id=request.user.id, target_object_id=post.id).exclude(verb='read')
        notices.update(verb='read')

    ctx = {
        'category': post.category,
        'post': post,
    }

    return TemplateResponse(request, 'posts/detail.html', ctx)

@login_required
def create(request):
    if request.method == 'POST':
        category_id = request.POST.get('category_id')
        if not category_id:
            category_id = 1
        category = Category.objects.get(pk=category_id)
        title = request.POST.get('title')
        content = request.POST.get('content', '')

        post, is_create = Post.objects.get_or_create(title=title, content=content, category=category, author=request.user)
        post.save()

        return HttpResponseRedirect('/posts/%s/' % post.id)
    
    return HttpResponseRedirect('/')

@login_required
def edit(request, post_id):
    if request.method == 'POST':
        post = get_object_or_404(Post, pk=post_id)
        if request.user == post.author:
            post.title = request.POST.get('title')
            post.content = request.POST.get('content')
            post.save()
        return HttpResponse(post.id)
    return HttpResponseRedirect('/')

@csrf_exempt
@login_required
def reply(request, post_id):
    if request.method == 'POST':
        reply = Reply()
        reply.post = Post.objects.get(pk=post_id)
        reply.author = request.user
        reply.content = request.POST.get('content')
        reply.save()

        response = model_to_dict(reply)
        response['user'] = _serialize_user(response['author'])
        return HttpResponse(json.dumps(response), content_type='application/json')
    else:
        try:
            reply_id = int(request.GET.get('reply_id'))
        except TypeError:
            return HttpResponse(json.dumps({'errorMessage': '获取回复内容失败，reply_id错误'}), content_type='application/json')

        reply = Reply.objects.get(pk=reply_id)
        response = model_to_dict(reply)
        response['user'] = _serialize_user(reply.author.id)

        return HttpResponse(json.dumps(response), content_type='application/json')

def _serialize_user(user_id):
    user = User.objects.get(pk=user_id)
    return {
        'username': user.username,
        'id': user.id,
        'gravatar': gravatar(user.email),
    }

def delete(request):
    object_id = request.GET.get('object_id')
    if request.GET.get('type').lower() == 'post':
        model = Post
    else:
        model = Reply

    row = model.objects.get(pk=object_id)
    response = {}
    if request.user.id == row.author.id:
        row.delete()
        response['status'] = 'ok'
    else:
        response['errorMessage'] = '没有删除权限'

    return HttpResponse(json.dumps(response), content_type='application/json')

def upload(request):
    today = datetime.datetime.today()
    upfile = request.FILES.get('upfile', '')

    file_type = str(upfile.name).split('.')[-1].lower()
    file_name = str(today.strftime("%Y%m%d%H-%f")) + '.' + file_type
    upfile.name = file_name
    attachment = Attachment.objects.create(user=request.user, src=upfile)
    return HttpResponse(attachment.src.url)

def search(request):
    if request.GET.get('q'):
        q = request.GET.get('q')
        posts = []
        for post in Post.objects.filter(title__contains=q):
            url = post.get_absolute_url()
            post = model_to_dict(post)
            post['url'] = url
            posts.append(post)
        
        response = {"status" : "ok", "data": posts}
        return HttpResponse(json.dumps(response), content_type='application/json')
