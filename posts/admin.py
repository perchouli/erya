from django.contrib import admin

from .models import Category, CategoryTag, Post, Reply
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'tag', 'created_at')

class CategoryTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'color')

admin.site.register(Category)
admin.site.register(Post, PostAdmin)
admin.site.register(CategoryTag, CategoryTagAdmin)
admin.site.register(Reply)
