from rest_framework import mixins
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions as drf_permissions

from events.models import Avatar, Event, EventParticipation, Organization, RegionalBranch, AcademicTitle, ProffInterest, StatusChangedRecord, User
from events import serializers
from events import permissions
from events.services import EventService, EventOrganizationService,\
    AffiliationService, AcademicTitleUserService, ProffInterestUserService,\
    UserStatusChangedRecordService, EventStatusChangedRecordService
from django.contrib.contenttypes.models import ContentType
from djoser.views import UserViewSet as DjoserViewSet
import datetime


class AvatarDetail(generics.RetrieveUpdateAPIView):
    queryset = Avatar.objects.all()
    serializer_class = serializers.AvatarSerializer

    permission_classes = [permissions.IsAvatarOwner | permissions.IsModerator]


class EventViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.EventSerializer
    filterset_fields = ['status']

    def get_permissions(self):
        if self.action == "update" or self.action == "destroy" or self.action == "partial_update":
            self.permission_classes = (
                permissions.IsApprovedUser, permissions.IsModeratorOrEventOrganizer)
        elif self.action == "create":
            self.permission_classes = (permissions.IsApprovedUser,)

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "create":
            self.serializer_class = serializers.CreateEventSerializer
        return self.serializer_class

    def get_queryset(self):
        queryset = EventService(self.request.user).filter_permitted()
        user_id = self.request.query_params.get('user')
        user_role = self.request.query_params.get('user_role')
        is_over = self.request.query_params.get('is_over')

        if user_id is not None:
            if user_role == "ORGANIZER":
                queryset &= Event.objects.filter_by_organizer(user=user_id)
            elif user_role == "REPORTER":
                queryset &= Event.objects.filter_by_reporter(user=user_id)
            else:
                queryset &= Event.objects.filter_by_organizer(
                    user=user_id) | Event.objects.filter_by_reporter(user=user_id)

        if is_over == "false":
            queryset = queryset.filter(date_end__gte=datetime.date.today())
        return queryset.distinct()

    def perform_destroy(self, instance):
        EventParticipation.objects.filter(event=instance).delete()
        instance.delete()


class EventOrganizationViewSet(viewsets.ModelViewSet):

    filterset_fields = ['event']

    def get_queryset(self):
        return EventOrganizationService(user=self.request.user).filter_permitted()

    def get_serializer_class(self):
        if (self.action == "update" or self.action == "partial_update" or
                self.action == "destroy" or self.action == "retrieve" or self.action == "list"):
            self.serializer_class = serializers.EventOrganizationSerializer
        elif self.action == "create":
            self.serializer_class = serializers.CreateEventOrganizationSerializer

        return self.serializer_class

    def get_permissions(self):
        if self.action == "update" or self.action == "destroy" or self.action == "partial_update" or self.action == "create":
            self.permission_classes = (
                permissions.IsApprovedUser, permissions.IsModeratorOrRelatedEventOrganizer)
        return super().get_permissions()


class EventParticipationViewSet(viewsets.ModelViewSet):

    queryset = EventParticipation.objects.all()
    filterset_fields = ['event', "user"]

    def get_permissions(self):
        if self.action == "update" or self.action == "partial_update":
            self.permission_classes = (
                permissions.IsApprovedUser, permissions.IsEventParticipationOwner)
        elif self.action == "destroy":
            self.permission_classes = (
                permissions.IsApprovedUser, permissions.IsEventParticipationOwnerOrRelatedEventOrganizer)
        elif self.action == "create":
            self.permission_classes = (permissions.IsApprovedUser,)

        return super().get_permissions()

    def get_serializer_class(self):
        if (self.action == "update" or self.action == "partial_update" or
                self.action == "destroy" or self.action == "retrieve" or self.action == "list"):
            self.serializer_class = serializers.EventParticipationSerializer
        elif self.action == "create":
            self.serializer_class = serializers.CreateEventParticipationSerializer

        return self.serializer_class


class OrganizationViewSet(mixins.RetrieveModelMixin,
                          mixins.ListModelMixin,
                          mixins.CreateModelMixin,
                          viewsets.GenericViewSet):

    serializer_class = serializers.OrganizationSerializer
    queryset = Organization.objects.all()


class UserRelatedViewSet(viewsets.ModelViewSet):

    serializer_to_create = None
    serializer = None

    service = None
    filterset_fields = ['user']

    def get_queryset(self):
        return self.service(user=self.request.user).filter_permitted()

    def get_permissions(self):
        if self.action == "update" or self.action == "destroy" or self.action == "partial_update":
            self.permission_classes = (
                drf_permissions.IsAuthenticated, permissions.IsUserRelatedOwner)
        elif self.action == "create":
            self.permission_classes = (drf_permissions.IsAuthenticated,)

        return super().get_permissions()

    def get_serializer_class(self):
        if (self.action == "update" or self.action == "partial_update" or
                self.action == "destroy" or self.action == "retrieve" or self.action == "list"):
            self.serializer_class = self.serializer
        elif self.action == "create":
            self.serializer_class = self.serializer_to_create

        return self.serializer_class


class AffiliationViewSet(UserRelatedViewSet):

    service = AffiliationService

    serializer = serializers.AffiliationSerializer
    serializer_to_create = serializers.CreateAffiliationSerializer


class AcademicTitleUserViewSet(UserRelatedViewSet):

    service = AcademicTitleUserService

    serializer = serializers.AcademicTitleUserSerializerSerializer
    serializer_to_create = serializers.CreateAcademicTitleUserSerializer


class ProffInterestUserViewSet(UserRelatedViewSet):

    service = ProffInterestUserService

    serializer = serializers.ProffInterestUserSerializer
    serializer_to_create = serializers.CreateProffInterestUserSerializer

# Dictionaries


class RegionalBranchRetrieveList(mixins.RetrieveModelMixin,
                                 mixins.ListModelMixin,
                                 viewsets.GenericViewSet):

    serializer_class = serializers.RegionalBranchSerializer
    queryset = RegionalBranch.objects.all()


class AcademicTitleRetrieveList(mixins.RetrieveModelMixin,
                                mixins.ListModelMixin,
                                viewsets.GenericViewSet):

    serializer_class = serializers.AcademicTitleSerializer
    queryset = AcademicTitle.objects.all()


class ProffInterestRetrieveList(mixins.RetrieveModelMixin,
                                mixins.ListModelMixin,
                                viewsets.GenericViewSet):

    serializer_class = serializers.ProffInterestSerializer
    queryset = ProffInterest.objects.all()


class UserStatusChangedRecordViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):

    filterset_fields = ['causer']

    serializer_class = serializers.UserStatusChangedRecordSerializer

    def get_queryset(self):
        queryset = UserStatusChangedRecordService(
            user=self.request.user).filter_permitted()
        user_id = self.request.query_params.get('user')
        if user_id is not None:
            user_content_type = ContentType.objects.get_for_model(User)
            queryset = queryset.filter(
                object_id=user_id, content_type=user_content_type.id)
        return queryset


class EventStatusChangedRecordViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):

    serializer_class = serializers.EventStatusChangedRecordSerializer

    def get_queryset(self):
        queryset = EventStatusChangedRecordService(
            user=self.request.user).filter_permitted()
        event_id = self.request.query_params.get('event')
        if event_id is not None:
            event_content_type = ContentType.objects.get_for_model(Event)
            queryset = queryset.filter(
                object_id=event_id, content_type=event_content_type.id)
        return queryset


class UserViewSet(DjoserViewSet):
    def get_serializer_class(self):
        user = self.request.user
        if self.action == "list":
            if user.is_moderator:
                self.serializer_class = serializers.UserSerializer
            else:
                self.serializer_class = serializers.RestrictedUserSerializer
        elif self.action == "retrieve":
            if user.is_moderator or user.id == int(self.kwargs['id']):
                self.serializer_class = serializers.UserSerializer
            else:
                self.serializer_class = serializers.RestrictedUserSerializer
        else:
            return super().get_serializer_class()
        return self.serializer_class
