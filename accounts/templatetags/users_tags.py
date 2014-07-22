# coding: utf-8
from django import template
from django.template.defaultfilters import stringfilter

import hashlib

register = template.Library()

@register.filter
def gravatar(value):
    return 'http://www.gravatar.com/avatar/' + hashlib.md5(value.encode('utf-8').lower()).hexdigest()
