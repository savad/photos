# -*- coding: utf-8 -*-
from django.contrib import admin

from images.models import Image


class ImageAdmin(admin.ModelAdmin):
    pass


admin.site.register(Image, ImageAdmin)
