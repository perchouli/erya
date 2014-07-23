# encoding: utf8

from django.template.response import TemplateResponse

from posts.models import Post, Reply

def home(request):

    ctx = {
        'recent_replies' : Reply.objects.all().order_by('-created_at')[:10],
    }
    return TemplateResponse(request, 'home.html', ctx)
