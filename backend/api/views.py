from django.shortcuts import render
from rest_framework import generics
from .models import MovieUpload
from .serializers import MovieUploadSerializer

# Create your views here.

class MovieUploadList(generics.ListCreateAPIView):
    serializer_class = MovieUploadSerializer
    queryset = MovieUpload.objects.all()


class MovieUploadDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MovieUploadSerializer
    queryset = MovieUpload.objects.all()