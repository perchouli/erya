from django.contrib import admin

from .models import Category, Post, Reply
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')


admin.site.register(Category)
admin.site.register(Post, PostAdmin)
admin.site.register(Reply)
