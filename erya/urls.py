from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'erya.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url('', include('accounts.urls')),
    url(r'^posts/', include('posts.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
