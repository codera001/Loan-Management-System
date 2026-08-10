from django.contrib import admin
from .models import Customer, Loan, Repayment

# Register your models here.
admin.site.site_header = 'LMS Admin'
admin.site.site_title = 'LMS Admin Area'
admin.site.index_title = ' Welcome to LMS admin area'
admin.site.register(Customer)
admin.site.register(Loan)
admin.site.register(Repayment)
