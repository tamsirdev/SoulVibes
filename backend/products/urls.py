from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('', views.ProductListView.as_view(), name='product-list'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('create/', views.ProductCreateView.as_view(), name='product-create'),
    path('<int:pk>/update/', views.ProductUpdateView.as_view(), name='product-update'),
    path('<int:pk>/delete/', views.ProductDeleteView.as_view(), name='product-delete'),
    path('seller/', views.SellerProductListView.as_view(), name='seller-products'),
    path('<int:pk>/reviews/', views.ReviewListView.as_view(), name='review-list'),
    path('<int:pk>/reviews/create/', views.ReviewCreateView.as_view(), name='review-create'),
]
