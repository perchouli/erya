from posts.models import Category
from actstream.models import Action

def categories(request):
    return {'CATEGORIES': Category.objects.all().order_by('sort')}

def actions(request):
    return {
        'NOTIFICATIONS': request.user and Action.objects.filter(actor_object_id=request.user.id).exclude(verb='read') or None
    }