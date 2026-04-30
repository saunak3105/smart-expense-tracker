from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'amount', 'category', 'payment_method', 'date')
    list_filter = ('category', 'payment_method', 'date')
    search_fields = ('title', 'user__username')