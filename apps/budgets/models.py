from django.db import models
from django.conf import settings
from django.db.models import Sum, Q
from decimal import Decimal

class Budget(models.Model):
    """Monthly budget tracking with real-time calculations"""
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                               related_name='budget')
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()  # First day of the month
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'month')
        ordering = ['-month']
        indexes = [
            models.Index(fields=['user', '-month']),
        ]
        verbose_name = 'Budget'
        verbose_name_plural = 'Budgets'
    
    def __str__(self):
        return f"Budget {self.month.strftime('%B %Y')} - ₹{self.monthly_limit}"
    
    def get_spent_amount(self):
        """Calculate total spent in current month"""
        from apps.expenses.models import Expense
        expenses = Expense.objects.filter(
            user=self.user,
            date__year=self.month.year,
            date__month=self.month.month,
            deleted_at__isnull=True
        ).aggregate(total=Sum('amount'))
        return expenses['total'] or Decimal('0.00')
    
    def get_remaining_amount(self):
        """Calculate remaining budget for the month"""
        return self.monthly_limit - self.get_spent_amount()
    
    def get_utilization_percentage(self):
        """Calculate budget utilization percentage"""
        spent = self.get_spent_amount()
        if self.monthly_limit == 0:
            return 0
        return float((spent / self.monthly_limit) * 100)
    
    def get_status(self):
        """Get budget status (OK, CAUTION, WARNING, EXCEEDED)"""
        percentage = self.get_utilization_percentage()
        if percentage >= 100:
            return 'EXCEEDED'
        elif percentage >= 90:
            return 'WARNING'
        elif percentage >= 80:
            return 'CAUTION'
        return 'OK'


class BudgetCategoryLimit(models.Model):
    """Per-category budget limits"""
    
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='category_limits')
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('budget', 'category')
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['budget', 'category']),
        ]
        verbose_name = 'Budget Category Limit'
        verbose_name_plural = 'Budget Category Limits'
    
    def __str__(self):
        return f"{self.category.name} - ₹{self.limit}"
    
    def get_spent_amount(self):
        """Calculate total spent in this category for the month"""
        from apps.expenses.models import Expense
        expenses = Expense.objects.filter(
            user=self.budget.user,
            category=self.category,
            date__year=self.budget.month.year,
            date__month=self.budget.month.month,
            deleted_at__isnull=True
        ).aggregate(total=Sum('amount'))
        return expenses['total'] or Decimal('0.00')
    
    def get_remaining_amount(self):
        """Calculate remaining budget for this category"""
        return self.limit - self.get_spent_amount()
    
    def get_utilization_percentage(self):
        """Calculate category budget utilization percentage"""
        spent = self.get_spent_amount()
        if self.limit == 0:
            return 0
        return float((spent / self.limit) * 100)
    
    def get_status(self):
        """Get category budget status"""
        percentage = self.get_utilization_percentage()
        if percentage >= 100:
            return 'EXCEEDED'
        elif percentage >= 90:
            return 'WARNING'
        elif percentage >= 80:
            return 'CAUTION'
        return 'OK'
