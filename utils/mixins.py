# -*- coding: utf-8 -*-
from __future__ import absolute_import, unicode_literals

from rest_framework import permissions
from rest_framework import serializers
from rest_framework.authentication import SessionAuthentication, TokenAuthentication


class UserRequired(object):
    """
    Mixin to check User is authenticated

    If nor user is not authenticated HTTP 401 UNAUTHORIZED will raise
    """
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (TokenAuthentication, SessionAuthentication)
