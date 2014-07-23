# coding: utf-8
from django.core.paginator import Paginator
from django.db.transaction import commit_on_success
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Category, CategoryTag, Post, Reply
from accounts.templatetags.users_tags import gravatar

import random
import datetime
import json


def post_list(request, category_id):
    category = Category.objects.get(pk=category_id)
    tags = CategoryTag.objects.filter(category=category)
    page_size = 50

    posts = Post.objects.approved().filter(category=category).order_by('-created_at')

    paginator = Paginator(posts, page_size)
    page = request.GET.get('page', 1)
    try:
        page = int(page)
    except:
        page = 1
    posts = paginator.page(page)

    ctx = {
        'paginator': paginator,
        'tags': tags,
        'category': category,
        'posts': posts,
    }
    return TemplateResponse(request, 'posts/category.html', ctx)

def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    post.pageviews = post.pageviews + 1 # TODO: Use SQL add 1
    post.save()

    ctx = {
        'category': post.category,
        'post': post,
        'tags': CategoryTag.objects.filter(category=post.category),
        'post_replies': Reply.objects.filter(post=post),
    }

    return TemplateResponse(request, 'posts/detail.html', ctx)

@login_required
def create(request):
    if request.method == 'POST':
        category_id = request.POST.get('category_id')
        if not category_id:
            category_id = 1
        category = Category.objects.get(pk=category_id)
        tag_id = request.POST.get('tag')
        title = request.POST.get('title')
        content = request.POST.get('content', '')

        post, is_create = Post.objects.get_or_create(title=title, content=content, category=category, tag_id=tag_id, author=request.user)
        post.save()

        return HttpResponseRedirect('/posts/%s/' % post.id)

@login_required
def reply(request, post_id):
    if request.method == 'POST':
        reply = Reply()
        reply.post = Post.objects.get(pk=post_id)
        reply.author = request.user
        reply.content = request.POST.get('content')
        reply.save()
        return HttpResponse(reply.id)
    else:
        reply_id = int(request.GET.get('reply_id'))
        reply = Reply.objects.get(pk=reply_id)
        response = model_to_dict(reply)
        user = User.objects.get(pk=reply.author.id)
        response['user'] = {
            'username': user.username,
            'id': user.id,
            'gravatar': gravatar(user.email),
        }
        response['created_at'] = reply.created_at.strftime('%Y-%m-%d %H:%M:%S')

        return HttpResponse(json.dumps(response), content_type='application/json')


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
        response['errorMessage'] = u'没有删除权限'

    return HttpResponse(json.dumps(response), content_type='application/json')
