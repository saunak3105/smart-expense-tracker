from django.contrib import admin
from .models import Expense, RecurringExpense, AuditLog

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'amount', 'category', 'date', 'payment_method', 'created_at')
    list_filter = ('category', 'payment_method', 'date', 'created_at')
    search_fields = ('description', 'user__email', 'tags')
    readonly_fields = ('created_at', 'updated_at', 'deleted_at')
    date_hierarchy = 'date'

@admin.register(RecurringExpense)
class RecurringExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'amount', 'frequency', 'is_active', 'next_due_date')
    list_filter = ('frequency', 'is_active', 'created_at')
    search_fields = ('description', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'expense', 'created_at')
    list_filter = ('action', 'created_at')
    search_fields = ('expense__description', 'user__email')
    readonly_fields = ('created_at', 'old_values', 'new_values')
