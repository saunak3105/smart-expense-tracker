from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.db.models import Sum
from .models import Category, Expense, Budget, CategoryBudgetLimit
from .serializers import CategorySerializer, ExpenseSerializer, BudgetSerializer, CategoryBudgetLimitSerializer, UserSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        now = timezone.now()
        month = request.query_params.get('month', now.month)
        year = request.query_params.get('year', now.year)

        expenses = self.get_queryset().filter(date__month=month, date__year=year)
        total_spent = expenses.aggregate(total=Sum('amount'))['total'] or 0
        
        budget = Budget.objects.filter(user=request.user, month=month, year=year).first()
        
        category_breakdown = list(expenses.values('category__name')
                                 .annotate(total_amount=Sum('amount'))
                                 .order_by('-total_amount'))

        return Response({
            'period': f"{month}/{year}",
            'total_spent': total_spent,
            'monthly_limit': budget.monthly_limit if budget else 0,
            'remaining_budget': budget.get_remaining_amount() if budget else 0,
            'utilization_percentage': budget.get_utilization_percentage() if budget else 0,
            'status': budget.get_status() if budget else "NO_BUDGET_SET",
            'category_breakdown': category_breakdown
        })


class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryBudgetLimitViewSet(viewsets.ModelViewSet):
    serializer_class = CategoryBudgetLimitSerializer

    def get_queryset(self):
        return CategoryBudgetLimit.objects.filter(budget__user=self.request.user)
