from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.TabularInline):
    model = UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)

class CustomUserAdmin(UserAdmin):
    inlines      = [UserProfileInline, ]
    list_display = ('username', 'email', 'date_joined', 'last_login', 'is_active' )
    ordering     = ('-id',)

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
