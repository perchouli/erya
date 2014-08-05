from django.apps import AppConfig
from actstream import registry

from .models import Post, Reply

class PostsConfig(AppConfig):
    name = 'posts'
    def ready(self):
        registry.register(Post)
        registry.register(Reply)
