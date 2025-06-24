# WildberriesParser
Парсер для маркетплейса Wildberries, позволяющий удобно отсортировать данные через веб-интерфейс на Django.

## Как начать работу
1. Создайте виртуальное окружение

```python -m venv venv```

2. Активируйте виртуальное окружение

```source venv/Scripts/activate```

3. Установите зависимости

```pip install requirements.txt```

4. Сделайте миграции (вы должны находится в том каталоге, где расположен manage.py)

```python manage.py makemigrations```

```python manage.py migrate```

5. Парсинг

```python manage.py parse например_телевизоры```

6. Просмотр данных и их анализ

```python manage.py runserver```

И далее переходите по локальному адресу сайта.