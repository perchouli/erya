from django.conf.urls import include, url, static
from django.contrib import admin
from django.conf import settings

urlpatterns = [
    # Examples:
    url(r'^$', 'erya.views.home', name='home'),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^posts/', include('posts.urls')),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
] + static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
