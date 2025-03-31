from django.db import models
from django.utils import timezone

# Create your models here.
class MovieUpload(models.Model):
    title = models.CharField(max_length=150)
    video_file = models.FileField(upload_to='movies', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnails', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title