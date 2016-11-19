from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^delete/$', views.delete),
    url(r'^upload/$', views.upload),
    url(r'^edit/(?P<post_id>\d+)/$', views.edit, name='edit_post'),
    url(r'^search/$', views.search, name='search_post'),
]
