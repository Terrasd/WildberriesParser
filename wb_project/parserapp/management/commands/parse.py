from django.core.management.base import BaseCommand
from parserapp.wb_parser import parse_products_from_wb
from parserapp.models import Product


class Command(BaseCommand):
    help = 'Парсит товары с Wildberries по ключевому слову'

    def add_arguments(self, parser):
        parser.add_argument(
            'query', type=str, help='Поисковый запрос (например, телевизор)'
        )

    def handle(self, *args, **kwargs):
        query = kwargs['query']
        self.stdout.write(f'Парсим товары по запросу: {query}')

        Product.objects.all().delete()

        products = parse_products_from_wb(query, max_pages=3)
        self.stdout.write(f'Найдено товаров: {len(products)}')

        for p in products:
            Product.objects.update_or_create(
                nm_id=p['nm_id'],
                defaults={
                    'name': p['name'],
                    'price': p['price'],
                    'sale_price': p['sale_price'],
                    'rating': p['rating'],
                    'feedbacks': p['feedbacks'],
                }
            )
        self.stdout.write('Товары успешно сохранены в базу данных.')
