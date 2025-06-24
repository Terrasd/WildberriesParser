from django.urls import path
from .views import ProductListAPIView, ProductPriceRangeAPIView, index

urlpatterns = [
    path('', index),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('products/price-range/', ProductPriceRangeAPIView.as_view()),
]
