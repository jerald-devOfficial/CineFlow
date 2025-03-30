from django.urls import path
from .views import MovieUploadList, MovieUploadDetail

urlpatterns = [
    path('movie/', MovieUploadList.as_view()),
    path('movie/<int:pk>', MovieUploadDetail.as_view()),
]
