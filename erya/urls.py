from django.conf.urls import include, url, static
from django.contrib import admin
from django.conf import settings

from django.contrib.auth import views as auth_views
import erya.api
import erya.views

urlpatterns = [
    url(r'^$', erya.views.home, name='home'),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^posts/', include('posts.urls')),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
] + static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + erya.api.api_urlpatterns
