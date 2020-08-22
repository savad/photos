from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter()
router.register(r'images', views.ImageViewSet)
router.register(r'delete-image', views.DeleteImageViewSet)
router.register(r'user', views.UserViewSet, base_name="users")

urlpatterns = [
    url(r'^v1/', include(router.urls)),
    url(r'^v1/upload-image/$', views.UploadImageView.as_view(), name='upload_image'),
    url(r'^v1/tags/$', views.TagView.as_view(), name='tags'),
]
