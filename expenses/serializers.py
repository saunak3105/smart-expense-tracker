from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Expense, Budget, CategoryBudgetLimit


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    formatted_amount = serializers.ReadOnlyField()

    class Meta:
        model = Expense
        fields = ['id', 'user', 'title', 'amount', 'category', 'category_name', 'payment_method', 'date', 'formatted_amount', 'created_at']
        read_only_fields = ['user']


class CategoryBudgetLimitSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = CategoryBudgetLimit
        fields = ['id', 'budget', 'category', 'category_name', 'limit_amount']


class BudgetSerializer(serializers.ModelSerializer):
    category_limits = CategoryBudgetLimitSerializer(many=True, read_only=True)
    spent_amount = serializers.DecimalField(source='get_spent_amount', max_digits=10, decimal_places=2, read_only=True)
    remaining_amount = serializers.DecimalField(source='get_remaining_amount', max_digits=10, decimal_places=2, read_only=True)
    utilization_percentage = serializers.FloatField(source='get_utilization_percentage', read_only=True)
    status = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = Budget
        fields = ['id', 'user', 'month', 'year', 'monthly_limit', 'category_limits', 'spent_amount', 'remaining_amount', 'utilization_percentage', 'status']
        read_only_fields = ['user']
