from django.db import models


class Product(models.Model):
    nm_id = models.BigIntegerField(unique=True)
    name = models.CharField(max_length=500)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    rating = models.FloatField(null=True, blank=True)
    feedbacks = models.IntegerField(default=0)

    def __str__(self):
        return self.name
