# coding=utf-8

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.forms.utils import ErrorList

class LoginForm(AuthenticationForm):
    username = forms.CharField(error_messages={'required': '用户名不能为空'}, max_length=30)
    password = forms.CharField(widget=forms.PasswordInput, error_messages={'required': '密码不能为空'})

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        if username and password:
            self.user_cache = authenticate(username=username, password=password)
            if self.user_cache is None:
                raise forms.ValidationError('请输入正确的用户名、密码')
                self.user_cache = authenticate(username = username, password=password)

        return self.cleaned_data

class RegistrationForm(forms.Form):
    email = forms.EmailField(error_messages = {'required': 'E-mail不能为空'})
    username = forms.CharField(error_messages = {'required': '用户名不能为空', 'max_length':'最多是8个字'}, max_length = 16)
    password = forms.CharField(widget=forms.PasswordInput, error_messages = {'required': '密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, min_length = 6, max_length = 16)
    confirm_password = forms.CharField(widget=forms.PasswordInput, error_messages = {'required': '确认密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, max_length = 16)
    
    def clean_email(self):
        email = self.cleaned_data['email']
        exists = User.objects.filter(email = email).count() > 0
        if exists:
            raise forms.ValidationError('邮箱已经被使用，请更换邮箱')
        return email
        
    def clean_username(self):
        username = self.cleaned_data['username']
        exists = User.objects.filter(username = username).count() > 0
        if exists:
            raise forms.ValidationError('该用户名已被使用，请重新输入')
        return username
    
    def clean(self):
        if ('confirm_password' in self.cleaned_data) and ('password' in self.cleaned_data):
            if (self.cleaned_data['confirm_password'] != self.cleaned_data['password']):
                self._errors["confirm_password"] = ErrorList(['密码和确认密码不一致'])
                del self.cleaned_data['password']
                del self.cleaned_data['confirm_password']
                
        return self.cleaned_data
    
class GetPasswordForm(forms.Form):
    email = forms.EmailField(max_length = 75, widget = forms.TextInput())
    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email = email).count() != 1:
            raise forms.ValidationError("这个邮箱不对应特定帐号!")
        return email

class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(error_messages = {'required': '原始密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, min_length = 6, max_length = 16)
    new_password = forms.CharField(error_messages = {'required': '新密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, min_length = 6, max_length = 16)
    confirm_password = forms.CharField(error_messages = {'required': '新密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, required = False, max_length = 16)
    
    def __init__(self, request, data):
        if request:
            super(ChangePasswordForm, self).__init__(data)
        else:
            super(ChangePasswordForm, self).__init__()
        self.request = request
    
    def clean(self):
        if 'old_password' in self.cleaned_data:
            if not self.request.user.check_password(self.cleaned_data['old_password']):
                self._errors['old_password'] = ErrorList(['原密码输入错误'])
                del self.cleaned_data['old_password']
        
        if ('confirm_password' in self.cleaned_data) and ('new_password' in self.cleaned_data):
            if (self.cleaned_data['confirm_password'] != self.cleaned_data['new_password']):
                self._errors["confirm_password"] = ErrorList(['新密码与确认密码不匹配'])
                del self.cleaned_data['new_password']
                del self.cleaned_data['confirm_password']
                
        return self.cleaned_data

class ResetPasswordForm(forms.Form):
    password = forms.CharField(error_messages = {'required': '新密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, min_length = 6, max_length = 16)
    confirm_password = forms.CharField(error_messages = {'required': '确认密码不能为空', 'min_length':'至少是6个字符', 'max_length':'最多是16个字符'}, max_length = 16)
    
    def clean(self):
  
        if ('confirm_password' in self.cleaned_data) and ('password' in self.cleaned_data):
            if (self.cleaned_data['confirm_password'] != self.cleaned_data['password']):
                self._errors["confirm_password"] = ErrorList(['新密码与确认密码不匹配'])
                del self.cleaned_data['password']
                del self.cleaned_data['confirm_password']
        return self.cleaned_data


class UserProfileForm(forms.Form):
    true_name = forms.CharField(required = False, error_messages = {'max_length':'最多是14个字符'}, max_length = 14)
    intro = forms.CharField(required = False)
    location = forms.CharField(required = False)
    #phone = forms.RegexField(required = False, regex = '1\d{10}', error_messages = {'invalid':'手机号码不规范'})
    email = forms.EmailField(max_length = 75, required = False, error_messages = {'max_length':'邮箱地址不要超过75字符'})
