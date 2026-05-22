from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .api_views import CategoryViewSet, ExpenseViewSet, BudgetViewSet, CategoryBudgetLimitViewSet, RegisterView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'category-limits', CategoryBudgetLimitViewSet, basename='category-limit')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/register/', RegisterView.as_view(), name='register'),
]
