from rest_framework import serializers

from sorl.thumbnail import get_thumbnail

from images.models import Image
from home.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'user_full_name', 'username', )
        read_only_fields = ('id', 'username', )

    def get_user_full_name(self, user):
        if user.first_name:
            return f"{user.first_name} {user.last_name}"
        return user.username


class ImagesSerializer(serializers.ModelSerializer):
    """
    Serializer for Image
    """
    user_full_name = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ('id', 'image_url', 'caption', 'user_full_name', 'created', 'published')
        read_only_fields = ('id', )

    def get_user_full_name(self, obj):
        user = obj.user
        if user.first_name:
            return f"{user.first_name} {user.last_name}"
        return user.username

    def get_image_url(self, obj):
        try:
            thumbnail = get_thumbnail(obj.image, '320x170', crop='center', quality=99)
            return self.context['request'].build_absolute_uri(thumbnail.url)
        except Esception as e:
            print("Thumbnail Error", e)
            return obj.image.url

