from django.contrib import admin
from .models import Category, Expense, Budget, CategoryBudgetLimit


class CategoryBudgetLimitInline(admin.TabularInline):
    model = CategoryBudgetLimit
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'amount_display', 'category', 'payment_method', 'date')
    list_filter = ('category', 'payment_method', 'date', 'user')
    search_fields = ('title', 'user__username', 'category__name')
    ordering = ('-date',)
    date_hierarchy = 'date'

    def amount_display(self, obj):
        return f"₹{obj.amount}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'month', 'year', 'monthly_limit', 'spent_display', 'remaining_display', 'utilization_display', 'status_display')
    list_filter = ('month', 'year', 'user')
    search_fields = ('user__username',)
    inlines = [CategoryBudgetLimitInline]

    def spent_display(self, obj):
        return f"₹{obj.get_spent_amount()}"
    spent_display.short_description = 'Spent'

    def remaining_display(self, obj):
        return f"₹{obj.get_remaining_amount()}"
    remaining_display.short_description = 'Remaining'

    def utilization_display(self, obj):
        return f"{obj.get_utilization_percentage()}%"
    utilization_display.short_description = 'Utilization'

    def status_display(self, obj):
        return obj.get_status()
    status_display.short_description = 'Status'
