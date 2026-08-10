from django.db import models

class Customer(models.Model):
    customers_name = models.CharField(max_length = 200)
    customers_email = models.EmailField(unique= True)
    customers_phone = models.CharField(max_length = 20)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customers_name

class Loan(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('defaulted', 'Defaulted'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    interest_rate = models.FloatField()
    tenor = models.IntegerField(help_text="Months")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.customers_name} - {self.amount}"


class Repayment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.loan.customer.customers_name} - {self.amount}"