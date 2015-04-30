from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^category/(?P<category_id>\d+)/$', views.post_list, name='category'),
    url(r'^(?P<post_id>\d+)/$', views.post_detail, name='post_detail'),
    url(r'^create/$', views.create),
    url(r'^delete/$', views.delete),
    url(r'^reply/(?P<post_id>\d+)/$', views.reply, name='reply_post'),
    url(r'^upload/$', views.upload),
    url(r'^edit/(?P<post_id>\d+)/$', views.edit, name='edit_post'),
]