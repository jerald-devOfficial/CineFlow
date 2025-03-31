from django.shortcuts import render
from rest_framework import generics
from .models import MovieUpload
from .serializers import MovieUploadSerializer
from django.http import FileResponse, HttpResponse
from rest_framework.response import Response
import os

# Create your views here.

class MovieUploadList(generics.ListCreateAPIView):
    serializer_class = MovieUploadSerializer
    queryset = MovieUpload.objects.all()


class MovieUploadDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MovieUploadSerializer
    queryset = MovieUpload.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.accepted_renderer.format == 'json':
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            path = instance.video_file.path
            file_size = os.path.getsize(path)
            
            # Handle range requests
            range_header = request.META.get('HTTP_RANGE', '').strip()
            range_match = range_header.replace('bytes=', '').split('-')
            
            if range_header and len(range_match) == 2:
                start_byte = int(range_match[0])
                end_byte = int(range_match[1]) if range_match[1] else file_size - 1
                
                if start_byte >= file_size:
                    return HttpResponse(status=416)  # Requested range not satisfiable
                
                length = end_byte - start_byte + 1
                response = FileResponse(
                    open(path, 'rb'),
                    status=206,  # Partial Content
                    as_attachment=False
                )
                response['Content-Range'] = f'bytes {start_byte}-{end_byte}/{file_size}'
                response['Content-Length'] = str(length)
            else:
                response = FileResponse(
                    open(path, 'rb'),
                    as_attachment=False
                )
                response['Content-Length'] = str(file_size)
            
            response['Accept-Ranges'] = 'bytes'
            response['Content-Type'] = 'video/mp4'
            response['Content-Disposition'] = f'inline; filename="{os.path.basename(path)}"'
            
            return response