from django.contrib import admin
from django.urls import path, include
from parserapp.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('api/', include('parserapp.urls')),
]
