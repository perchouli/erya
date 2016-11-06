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

    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
] + static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + erya.api.api_urlpatterns

def global_route(request, path):
    js_app_name = 'home' if path == '' else path.lower().split('/')[0]
    dataset = ''
    if js_app_name != 'home':
        dataset_list = list(filter(len, path.lower().replace(js_app_name, '').split('/')))
        dataset = ' '.join(
            ['data-{0}="{1}"'.format(
                (('id', 'action') + ('ext',) * (len(dataset_list) - 2))[i],
                dataset_list[i]
            )
            for i in range(len(dataset_list))
            ]
        )
    return HttpResponse(Template('{% extends "base.html" %}{% block content %}<div id="'+js_app_name+'" '+dataset+' />{% endblock %}').render(RequestContext(request)))

urlpatterns.append(url(r'^(?P<path>(.*))$', global_route))
