from posts.models import Category
from actstream.models import Action

def categories(request):
    return {'CATEGORIES': Category.objects.all().order_by('sort')}

def actions(request):
    return {
        'REPLY_NOTIFICATIONS': request.user and Action.objects.filter(actor_object_id=request.user.id, verb='receive') or None
    }