# coding: utf-8
from django import template
from django.template.defaultfilters import stringfilter

import hashlib
import bleach

register = template.Library()

@register.filter
def substring(value, arg):
    try:
        length = int(arg)
    except ValueError:
        return value
    
    if len(value) < length:
        return value
    else:
        return value[0:length] + '...'
substring.is_safe = True
substring = stringfilter(substring)

@register.filter
def filter_xss(value):
    tags = ['a', 'p', 'em', 'strong']
    cleaned_text = bleach.clean(value, tags, strip=True)
    return cleaned_text