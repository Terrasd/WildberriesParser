from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


class ProductListAPIView(APIView):
    def get(self, request):
        queryset = Product.objects.all()

        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        min_rating = request.GET.get('min_rating')
        min_feedbacks = request.GET.get('min_feedbacks')
        ordering = request.GET.get('ordering')

        if min_price is not None:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price is not None:
            queryset = queryset.filter(price__lte=float(max_price))
        if min_rating is not None:
            queryset = queryset.filter(rating__gte=float(min_rating))
        if min_feedbacks is not None:
            queryset = queryset.filter(feedbacks__gte=int(min_feedbacks))

        allowed_fields = [
            'price', 'rating', 'feedbacks', 'name', 'sale_price'
        ]
        if ordering:
            direction = ''
            field = ordering

            if ordering.startswith('-'):
                direction = '-'
                field = ordering[1:]

            if field in allowed_fields:
                queryset = queryset.order_by(f"{direction}{field}")

        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductPriceRangeAPIView(APIView):
    def get(self, request):
        min_price = Product.objects.order_by('price').first().price
        max_price = Product.objects.order_by('-price').first().price
        return Response({
            'min_price': min_price,
            'max_price': max_price
        }, status=status.HTTP_200_OK)


def index(request):
    return render(request, 'index.html')
