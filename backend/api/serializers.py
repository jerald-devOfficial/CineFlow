from rest_framework import serializers
from .models import MovieUpload


class MovieUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieUpload
        fields = ('__all__')
