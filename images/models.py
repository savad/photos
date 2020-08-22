import uuid

from django.db import models
from django.utils.translation import ugettext_lazy as _

from taggit.managers import TaggableManager

from home.models import User


def get_image_path(instance, filename):
    ext = filename.split('.')[-1]
    if instance.id:
        random_value = uuid.uuid1()
        filename = "feed-image/1000%s%s.%s" % (instance.id, random_value, ext)
    else:
        images = Image.objects.all().order_by('-id')
        val = 1
        if images:
            val = images[0].id + 1
        filename = "feed-image/1000%s.%s" % (val, ext)
    return filename


class Image(models.Model):
    """
    Model for saving image , alternate_text, caption etc
    """
    user = models.ForeignKey(User)
    image = models.ImageField(_('Image'), upload_to=get_image_path, max_length=1000)
    caption = models.TextField(_('Image Caption'), null=True, blank=True)
    hash_tags = TaggableManager(blank=True)
    published = models.BooleanField(_('Published?'), default=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    # def __unicode__(self):
    #     return u'%s - %s' % (self.id, self.content_type)


    # def save(self, *args, **kwargs):
    #     if self.published:
    #         self.user.point += config.UPLOAD_PHOTO_POINT
    #         self.user.save()
    #     super(Image, self).save(*args, **kwargs)

