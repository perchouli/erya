from django.conf.urls import include, url, static
from django.contrib import admin
from django.conf import settings

from django.contrib.auth import views as auth_views
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.template import RequestContext, Template
import erya.api
import erya.views

urlpatterns = [
    url(r'^accounts/', include('accounts.urls')),
    url(r'posts/', include('posts.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
] + static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + erya.api.api_urlpatterns

def global_route(request, path):
    js_app_name = 'home' if path == '' else path.replace('/', '').lower()
    return HttpResponse(Template('{% extends "base.html" %}{% block content %}<div id="'+js_app_name+'" />{% endblock %}').render(RequestContext(request)))

urlpatterns.append(url(r'^(?P<path>(.*))$', global_route))
