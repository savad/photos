# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals
import re
import base64
from collections import OrderedDict
from collections import Counter

from django.core.files.base import ContentFile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from taggit.models import Tag

from images.models import Image
from home.models import User
from images.forms import ImageForm
from utils import mixins
from api.serializers import ImagesSerializer, UserSerializer


class ImageViewSet(mixins.UserRequired, viewsets.ModelViewSet):
    """
    Viewset for listing images
    """
    http_method_names = ['get', ]
    serializer_class = ImagesSerializer
    queryset = Image.objects.filter(published=True)
    model = Image

    def get_queryset(self):
        queryset = self.queryset
        if self.request.GET.get('user') == 'self':
            queryset = queryset.filter(user=self.request.user)
        elif self.request.GET.get('user'):
            queryset = queryset.filter(user__id=self.request.GET.get('user'))
        if self.request.GET.get('tag'):
            queryset = queryset.filter(hash_tags__name__in=[self.request.GET.get('tag')])
        if self.request.GET.get('order') == 'oldest':
            queryset = queryset.order_by('created')
        else:
            queryset = queryset.order_by('-created')
        if self.request.GET.get('draft') == 'true':
            queryset = Image.objects.filter(user=self.request.user, published=False).order_by('-created')[:1]
        return queryset


class DeleteImageViewSet(ImageViewSet):
    """
    Viewset for deleting images
    """
    http_method_names = ['delete', ]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class UserViewSet(mixins.UserRequired, viewsets.ModelViewSet):
    """
    Viewset for listing users
    """
    http_method_names = ['get', ]
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True)
    model = User


class UploadImageView(mixins.UserRequired, APIView):
    """
    View for saving Image, Caption and Hash tags
    """

    def post(self, request, *args, **kwargs):
        ctx = {}
        caption = request.data.get('caption')
        if not self.request.GET.get('id'):
            image_file = self.create_image_file(request.data['file'])
            image = Image.objects.create(image=image_file, user=request.user)
        elif request.data.get('file') and not request.data.get('file') == 'undefined':
            image = Image.objects.get(id=self.request.GET.get('id'))
            image_file = self.create_image_file(request.data['file'])
            image.image = image_file
        else:
            image = Image.objects.get(id=self.request.GET.get('id'))
        if not self.request.GET.get('draft') == 'true':
            image.published = True
        image.caption = caption
        image.save()
        image.hash_tags.all().delete()
        [image.hash_tags.add(tag[1:]) for tag in re.findall("[#]\w+", caption)]
        ctx['status'] = 'success'
        ctx['data'] = {'caption': caption, 'image': image.image.url, 'published': image.published, 'id': image.id}
        return Response(ctx)

    @staticmethod
    def create_image_file(file):
        format, file_string = file.split(';base64,')
        ext = format.split('/')[-1]
        image_file = ContentFile(base64.b64decode(file_string), name='file.' + ext)
        return image_file


class TagView(mixins.UserRequired, APIView):
    """
    Viewset for listing tags
    """

    def get(self, request):
        tags = [tag.name for tag in Tag.objects.all()]
        sorted_tags = [item for items, c in Counter(tags).most_common() for item in [items] * c]
        tags = list(OrderedDict.fromkeys(sorted_tags))
        return Response(tags)
