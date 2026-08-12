from django.urls import path
from . import views
# new
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, LoanViewSet, RepaymentViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet)
router.register('loans', LoanViewSet)
router.register('repayments', RepaymentViewSet)
urlpatterns = router.urls

# old
# app_name = 'cms'
# urlpatterns = [
#     path('register/', views.registerPage, name='register'),
#     path('login/', views.loginPage, name='login'),
#     path('logout/', views.logoutUser, name='logout'),


#     path('', views.index, name='index'),
#     path('<int:customer_id>/detail', views.detail, name='detail'),
#     path('<int:customer_id>/update', views.update, name='update'),
#     path('add/', views.add, name='add'),
#     path('<int:customer_id>/delete', views.delete, name='delete'),
# ]