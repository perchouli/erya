# encoding: utf8

from django.template.response import TemplateResponse

def home(request):
	ctx = {}
	return TemplateResponse(request, 'home.html', ctx)