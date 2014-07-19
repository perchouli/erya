from django.contrib import admin

from .models import Category, Thread, CategoryTag, Post
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'tag', 'created_at')

class CategoryTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'color')

admin.site.register(Category)
admin.site.register(Thread, ThreadAdmin)
admin.site.register(CategoryTag, CategoryTagAdmin)
admin.site.register(Post)
