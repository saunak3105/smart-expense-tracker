from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Expense, Budget, Category
from django.utils import timezone
from django.db.models import Sum


@login_required
def dashboard_data(request):
    """
    Returns analytics for the logged-in user for the current month.
    """
    now = timezone.now()
    month = now.month
    year = now.year

    # Current month expenses for the user
    expenses = Expense.objects.filter(user=request.user, date__month=month, date__year=year)
    
    total_spent = expenses.aggregate(total=Sum('amount'))['total'] or 0
    
    # Get overall budget
    budget = Budget.objects.filter(user=request.user, month=month, year=year).first()
    
    # Category-wise breakdown
    category_breakdown = list(expenses.values('category__name')
                             .annotate(total_amount=Sum('amount'))
                             .order_by('-total_amount'))

    data = {
        'user': request.user.username,
        'period': f"{now.strftime('%B')} {year}",
        'total_spent': float(total_spent),
        'monthly_limit': float(budget.monthly_limit) if budget else 0,
        'remaining_budget': float(budget.get_remaining_amount()) if budget else 0,
        'utilization_percentage': budget.get_utilization_percentage() if budget else 0,
        'status': budget.get_status() if budget else "NO_BUDGET_SET",
        'category_breakdown': category_breakdown
    }

    return JsonResponse(data)


def home(request):
    return JsonResponse({"message": "Expense Tracker API is running", "dashboard_url": "/dashboard/"})
