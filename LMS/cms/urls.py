from django.urls import path
from . import views

app_name = 'cms'
urlpatterns = [
    path('register/', views.registerPage, name='register'),
    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutUser, name='logout'),


    path('', views.index, name='index'),
    path('<int:customer_id>/detail', views.detail, name='detail'),
    path('<int:customer_id>/update', views.update, name='update'),
    path('add/', views.add, name='add'),
    path('<int:customer_id>/delete', views.delete, name='delete'),
]