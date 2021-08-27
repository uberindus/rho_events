from django.core.checks import messages
from rest_framework import permissions
from rest_framework import exceptions
from rest_framework.permissions import SAFE_METHODS
from rest_framework import status
from rest_framework.exceptions import APIException

from events.models import Avatar, Event, EventOrganization, EventParticipation
from events import constants

from events import views


class IsAuthenticated(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsApprovedUser(permissions.IsAuthenticated):
    message = 'This action is permitted for APPROVED users'

    def has_permission(self, request, view):
        return super().has_permission(request, view) and \
            request.user.status == constants.StatusCode.APPROVED

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsModerator(permissions.IsAuthenticated):
    message = 'This action is permitted for Moderator'

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_moderator

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


# can use instead isUserRelated
class IsAvatarOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsEventOrganizer(permissions.BasePermission):
    message = 'This action is permitted only for  Event organizer'

    def has_object_permission(self, request, view, obj):
        return request.user.is_event_organizer(obj)


class IsRelatedEventOrganizer(permissions.BasePermission):
    message = 'This action is permitted only for  Event organizer'

    def has_permission(self, request, view):
        if request.method == "post":
            event = request.data.get("event", None)
            if event:
                return request.user.is_event_organizer(event)
            else:
                raise exceptions.ValidationError("event must be specified")
        return True

    def has_object_permission(self, request, view, obj):
        event = obj.event
        return request.user.is_event_organizer(event)


class IsUserRelatedOwner(permissions.BasePermission):
    message = "This action is permitted only for entity's owner"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsEventParticipationOwner(permissions.BasePermission):
    message = "This action is permitted only for this event participation entity owner"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsModeratorOrEventOrganizer(permissions.BasePermission):
    message = "This action is permitted only for Moderator or event's organizer"

    def has_permission(self, request, view):
        return IsModerator().has_permission(request, view) or IsEventOrganizer().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsModerator().has_object_permission(request, view, obj) or IsEventOrganizer().has_object_permission(request, view, obj)


class IsModeratorOrRelatedEventOrganizer(permissions.BasePermission):
    message = "This action is permitted only for Moderator or event's organizer"

    def has_permission(self, request, view):
        return IsModerator().has_permission(request, view) or IsRelatedEventOrganizer().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsModerator().has_object_permission(request, view, obj) or IsRelatedEventOrganizer().has_object_permission(request, view, obj)


class IsEventParticipationOwnerOrRelatedEventOrganizer(permissions.BasePermission):

    def has_permission(self, request, view):
        return IsEventParticipationOwner().has_permission(request, view) or\
            IsRelatedEventOrganizer().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsEventParticipationOwner().has_object_permission(request, view, obj) or\
            IsRelatedEventOrganizer().has_object_permission(request, view, obj)


class IsCurrentUser(permissions.IsAuthenticated):
    message = "This action is permitted only for current user"

    def has_object_permission(self, request, view, obj):
        return obj.pk == request.user.pk


class IsCurrentUserOrModerator(permissions.BasePermission):
    message = "This action is permitted only for current user or moderator"

    def has_permission(self, request, view):
        return IsCurrentUser().has_permission(request, view) or\
            IsModerator().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsCurrentUser().has_object_permission(request, view, obj) or\
            IsModerator().has_object_permission(request, view, obj)


class IsCurrentUserOrApproved(permissions.BasePermission):
    message = "This action is permitted only for current or approved user"

    def has_permission(self, request, view):
        return IsCurrentUser().has_permission(request, view) or\
            IsApprovedUser().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsCurrentUser().has_object_permission(request, view, obj) or\
            IsApprovedUser().has_object_permission(request, view, obj)


class IsCurrentUserOrAuthenticated(permissions.BasePermission):
    message = "This action is permitted only for current or authenticated user"

    def has_permission(self, request, view):
        return IsCurrentUser().has_permission(request, view) or\
            IsAuthenticated().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return IsCurrentUser().has_object_permission(request, view, obj) or\
            IsAuthenticated().has_object_permission(request, view, obj)
