from django.conf.urls import patterns, include, url

urlpatterns = patterns('posts.views',
    url(r'^category/(?P<category_id>\d+)/$', 'post_list', name='category'),
    url(r'^(?P<post_id>\d+)/$', 'post_detail', name='post_detail'),
    url(r'^create/$', 'create'),
    url(r'^reply/(?P<post_id>\d+)/$', 'reply'),
    # url(r'^edit/(?P<post_id>\d+)/$', 'edit_post'),
)
