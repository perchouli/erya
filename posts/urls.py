from django.conf.urls import patterns, url

urlpatterns = patterns('posts.views',
    url(r'^category/(?P<category_id>\d+)/$', 'post_list', name='category'),
    url(r'^(?P<post_id>\d+)/$', 'post_detail', name='post_detail'),
    url(r'^create/$', 'create'),
    url(r'^delete/$', 'delete'),
    url(r'^reply/(?P<post_id>\d+)/$', 'reply', name='reply_post'),
    url(r'^upload/$', 'upload'),
    url(r'^edit/(?P<post_id>\d+)/$', 'edit', name='edit_post'),
)
