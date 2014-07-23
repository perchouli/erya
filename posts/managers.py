from django.db.models import Manager
from django.db.models.query import QuerySet


class PostQuerySet(QuerySet):
    def approved(self):
        return self.filter(status__exact=self.model.STATUS_APPROVED)

    def expired(self):
        return self.filter(status__exact=self.model.STATUS_EXPIRED)

    def rejected(self):
        return self.filter(status__exact=self.model.STATUS_REJECTED)

    def removed(self):
        return self.filter(status__exact=self.model.STATUS_REMOVED)

class PostManager(Manager):
    def get_queryset(self):
        return PostQuerySet(self.model, using=self._db)

    def approved(self):
        return self.get_query_set().approved()

    def expired(self):
        return self.get_query_set().expired()

    def rejected(self):
        return self.get_query_set().rejected()

    def removed(self):
        return self.get_query_set().removed()
