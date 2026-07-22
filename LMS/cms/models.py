from django.db import models

class Customer(models.Model):
    customers_name = models.CharField(max_length = 200)
    customers_email = models.EmailField(unique= True)
    customers_phone = models.CharField(max_length = 20)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customers_name