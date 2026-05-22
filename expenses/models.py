from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum
from decimal import Decimal


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Category Name")
    description = models.TextField(blank=True, null=True, verbose_name="Description")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Expense(models.Model):
    PAYMENT_CHOICES = [
        ('CASH', 'Cash'),
        ('CARD', 'Card'),
        ('UPI', 'UPI'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses', verbose_name="User")
    title = models.CharField(max_length=255, verbose_name="Title")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Amount")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='expenses', verbose_name="Category")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, verbose_name="Payment Method")
    date = models.DateField(db_index=True, verbose_name="Date")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        verbose_name = "Expense"
        verbose_name_plural = "Expenses"
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount}"

    @property
    def formatted_amount(self):
        return f"₹{self.amount}"


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets', verbose_name="User")
    month = models.PositiveSmallIntegerField(verbose_name="Month")
    year = models.PositiveSmallIntegerField(verbose_name="Year")
    monthly_limit = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monthly Limit")

    class Meta:
        verbose_name = "Budget"
        verbose_name_plural = "Budgets"
        unique_together = ('user', 'month', 'year')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year} (Limit: {self.monthly_limit})"

    def get_spent_amount(self):
        return Expense.objects.filter(
            user=self.user,
            date__month=self.month,
            date__year=self.year
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

    def get_remaining_amount(self):
        return self.monthly_limit - self.get_spent_amount()

    def get_utilization_percentage(self):
        spent = self.get_spent_amount()
        if self.monthly_limit > 0:
            return round((spent / self.monthly_limit) * 100, 2)
        return 0

    def get_status(self):
        percentage = self.get_utilization_percentage()
        if percentage < 80:
            return "OK"
        elif percentage < 90:
            return "CAUTION"
        elif percentage < 100:
            return "WARNING"
        else:
            return "EXCEEDED"


class CategoryBudgetLimit(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name='category_limits', verbose_name="Budget")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Category")
    limit_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Category Limit")

    class Meta:
        verbose_name = "Category Budget Limit"
        verbose_name_plural = "Category Budget Limits"
        unique_together = ('budget', 'category')

    def __str__(self):
        return f"{self.category.name} limit for {self.budget}"
