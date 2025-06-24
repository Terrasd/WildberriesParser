import requests


def parse_products_from_wb(query, max_pages=1):
    all_products = []

    for page in range(1, max_pages + 1):
        url = 'https://search.wb.ru/exactmatch/ru/common/v4/search'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json',
        }
        params = {
            'ab_testing': 'false',
            'appType': '1',
            'curr': 'rub',
            'dest': '-1257786',
            'query': query,
            'page': page,
            'resultset': 'catalog',
            'sort': 'popular',
            'spp': '30',
        }

        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f'[{page}] Ошибка запроса: {e}')
            break

        products = data.get('data', {}).get('products', [])
        if not products:
            print(f'[{page}] Товары не найдены')
            break

        for product in products:
            all_products.append({
                'nm_id': product.get('id'),
                'name': product.get('name'),
                'price': product.get('priceU') / 100,
                'sale_price': (
                    (product.get('salePriceU') / 100) -
                    (product.get('logisticsCost') / 100)
                ) if product.get('salePriceU') else None,
                'rating': product.get('reviewRating'),
                'feedbacks': product.get('feedbacks'),
            })

    return all_products
