from django.conf.urls import include, url
from django.contrib.auth import views as auth_views

from .forms import LoginForm
from . import views

urlpatterns = [
    url(r'^login/$', auth_views.login, {'template_name': 'accounts/login.html', 'authentication_form': LoginForm}, name='login'),
    url(r'^register/$', views.register, name='register'),
    # url(r'^settings/$', 'settings', name='settings'),
    url(r'^profile/(?P<user_id>\d+)/$', views.profile, name='profile'),
    # url(r'^password/set/$','set_password'),
    url(r'^logout/$', auth_views.logout, {'template_name': 'home.html'}, name='logout'),
]