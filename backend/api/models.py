from django.db import models


class Insight(models.Model):
    end_year = models.TextField(blank=True, null=True)
    intensity = models.IntegerField(null=True)
    sector = models.TextField(null=True)
    topic = models.TextField(null=True)
    insight = models.TextField(default="")
    url = models.TextField(default="")
    region = models.TextField(null=True)
    start_year = models.TextField(blank=True, null=True)
    impact = models.TextField(blank=True, null=True)
    added = models.DateTimeField(null=True)
    published = models.DateTimeField(null=True)
    country = models.TextField(null=True)
    relevance = models.IntegerField(null=True)
    pestle = models.TextField(null=True)
    source = models.TextField(null=True)
    title = models.TextField(default="")
    likelihood = models.IntegerField(null=True)
    objects = models.Manager()
