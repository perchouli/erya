# encoding: utf8

from django.template.response import TemplateResponse

from posts.models import Post, Reply

def home(request):
    posts = Post.objects.all().order_by('-date')

    ctx = {
        'recent_replies' : Reply.objects.all()[:10],
    }
    return TemplateResponse(request, 'home.html', ctx)
