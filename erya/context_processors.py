from posts.models import Category

def categories(request):
    return {'CATEGORIES': Category.objects.all().order_by('sort')}
