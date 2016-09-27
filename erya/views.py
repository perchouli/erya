# encoding: utf8

from django.template.response import TemplateResponse

from posts.models import Post

def home(request):
    ctx = {

    }
    return TemplateResponse(request, 'home.html', ctx)
