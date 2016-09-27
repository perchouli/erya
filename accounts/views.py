from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.template.response import TemplateResponse

from posts.models import Post

from .forms import RegistrationForm
from .models import UserProfile

def register(request):
    if request.user.is_authenticated():
        return redirect('home')
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            new_user = User.objects.create_user(username=username, email=email, password=password)
            new_user_profile = UserProfile.objects.get(user=new_user)
            new_user_profile.user_agent = request.META.get('HTTP_USER_AGENT', None)
            new_user_profile.save()

            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('home')
    else:
        form = RegistrationForm()

    ctx = {
        'form' : form,
    }
    return TemplateResponse(request, 'accounts/register.html', ctx)

def profile(request, user_id):
    master = User.objects.get(pk=user_id)
    user_profile = UserProfile.objects.get(user=master)
    recent_posts = Post.objects.filter(author=master).order_by('-created_at')[:20]

    ctx = {
        'recent_posts': recent_posts,
        'master': master,
        'recent_posts': recent_posts,
        'user_profile': user_profile,
        'count': Post.objects.filter(author=master).count(),
    }
    return TemplateResponse(request, 'accounts/profile.html', ctx)
