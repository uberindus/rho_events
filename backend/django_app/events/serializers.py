from events.services import AcademicTitleUserService
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.contenttypes import fields
from django.core import exceptions as django_exceptions
from django.db import IntegrityError, transaction
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError
from rest_framework.settings import api_settings
from rest_framework.authtoken.models import Token

from events.models import Avatar, Event, EventOrganization, EventParticipation, Organization, Affiliation, AcademicTitle, ProffInterest, ProffInterestUser, RegionalBranch, StatusChangedRecord, AcademicTitleUser
from events import constants

User = get_user_model()


####################################################################################################################
# TOKENSERIALIZER SERIALIZER
####################################################################################################################

class TokenSerializer(serializers.ModelSerializer):
    auth_token = serializers.CharField(source="key")
    is_moderator = serializers.CharField(source="user.is_moderator")
    status = serializers.CharField(source="user.status")

    class Meta:
        model = Token
        fields = ("auth_token", "user", "is_moderator", "status")


####################################################################################################################
# STATUS CHANGE MIXIN SERIALIZER
####################################################################################################################

class StatusChangeMixin:

    default_error_messages = {
        "status_beyond": "If status is PROCESS or DRAFT it can not be changed to PROCESS or DRAFT",
        "not_allowed_status": "Without privileges only PROCESS or DRAFT are allowed during creation",
        "status_changed": "If status is not PROCESS or DRAFT it can not be changed"
    }

    def validate_status(self, value):
        instance = self.instance
        user = self.context["request"].user

        if not user.is_moderator:
            if instance:
                if instance.status == constants.StatusCode.DRAFT or\
                        instance.status == constants.StatusCode.PROCESS:
                    if value != constants.StatusCode.PROCESS and value != constants.StatusCode.DRAFT:
                        self.fail("status_beyond")
                        # если переход делается из драфта и процесса не в это
                        # же множество, то ошибка
                else:
                    if value != instance.status:
                        self.fail("status_changed")
                    # если инстантс существует и его статус не отклонен, то тогда менять уже ничего нельзя
            # если пользователь создает event
        return value

    def validate(self, attrs):
        method = self.context['request'].method
        if method == "POST" or method == "PATCH":
            status = attrs.get('status', None)
            comment = attrs.get('comment', None)
            if status == constants.StatusCode.REJECTED:
                if not comment:
                    raise ValidationError(
                        "If status REJECTED, then comment is mandatory")
        return attrs

    def update(self, instance, validated_data):
        comment = validated_data.pop("comment", "")
        with transaction.atomic():
            status_before = instance.status
            instance = super().update(instance, validated_data)
            if instance.status != status_before:
                user = self.context["request"].user
                StatusChangedRecord.objects.create(
                    content_object=instance,
                    previous_status=status_before,
                    current_status=instance.status,
                    causer=user,
                    comment=comment,
                )
        return instance

####################################################################################################################
# USER SERIALIZER
####################################################################################################################


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True, required=True)
    re_password = serializers.CharField(
        style={"input_type": "password"}, write_only=True, required=True)

    default_error_messages = {
        "cannot_create_user": "Unable to create account.",
        "password_mismatch": "password_mismatch"
    }

    class Meta:
        model = User
        fields = ['id', 'first_name', 'password', 're_password', 'last_name', 'patronymic', 'birthday',
                  'email', 'phone_number', 'academic_rank',
                  'regional_branch', 'avatar', 'status', 'is_moderator'
                  ]
        read_only_fields = ["id", "avatar", "status", "is_moderator"]

    def validate(self, attrs):

        re_password = attrs.pop("re_password")
        password = attrs.get("password")
        if not password == re_password:
            self.fail("password_mismatch")

        user = User(email=attrs['email'])

        try:
            validate_password(password, user)
        except django_exceptions.ValidationError as e:
            serializer_error = serializers.as_serializer_error(e)
            raise serializers.ValidationError(
                {"password": serializer_error[api_settings.NON_FIELD_ERRORS_KEY]}
            )
        return attrs

    def create(self, validated_data):
        try:
            with transaction.atomic():
                ava = Avatar.objects.create()
                user = User.objects.create_user(
                    **validated_data, status=constants.StatusCode.DRAFT, avatar=ava)
        except IntegrityError:
            self.fail("cannot_create_user")

        return user


class UserSerializer(StatusChangeMixin, serializers.ModelSerializer):

    comment = serializers.CharField(
        write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'patronymic', 'birthday',
                  'email', 'phone_number', 'academic_rank',
                  'regional_branch', 'avatar', 'status', 'comment',
                  ]
        read_only_fields = ["id", "email", "avatar"]


class RestrictedUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'patronymic', 'birthday', ]
        read_only_fields = ['id', 'first_name',
                            'last_name', 'patronymic', 'birthday', ]

####################################################################################################################
# AVATAR SERIALIZER
####################################################################################################################


class AvatarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Avatar
        fields = ['id', 'photo']
        read_only_fields = ['id']
        extra_kwargs = {'photo': {'required': True}}

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

####################################################################################################################
# EVENT SERIALIZER
####################################################################################################################


class CreateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'date_begin', 'date_end', 'place',
                  'brief_description', 'full_description', 'site',
                  'is_over',
                  ]
        read_only_fields = ['id', "is_over"]

    @transaction.atomic
    def create(self, validated_data):
        event = Event.objects.create(
            **validated_data, status=constants.StatusCode.DRAFT)
        user = self.context['request'].user
        EventParticipation.objects.create(
            event=event, user=user, role=constants.EventRole.ORGANIZER)
        return event


class EventSerializer(StatusChangeMixin, serializers.ModelSerializer):

    comment = serializers.CharField(
        write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'date_begin', 'date_end', 'place',
                  'brief_description', 'full_description', 'site',
                  'status', 'is_over', 'comment'
                  ]
        read_only_fields = ['id', "is_over"]

####################################################################################################################
# ORGANIZATION SERIALIZER
####################################################################################################################


class OrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organization
        fields = ['id', 'title']
        read_only_fields = ['id']


####################################################################################################################
# EVENTORGANIZATION SERIALIZER
####################################################################################################################

class CreateEventOrganizationSerializer(serializers.ModelSerializer):

    default_error_messages = {
        "exceed_main_org_limit": "Limit of main organizers is 1",
        "main_org_must_be": "Before creating of co-orgs, main org must be created"
    }

    class Meta:
        model = EventOrganization
        fields = ['id', 'role_description', 'role', 'event', 'organization']
        read_only_fields = ['id']
        extra_kwargs = {'event': {'required': True}, 'role': {
            'required': True}, 'organization': {'required': True}}

    # Проверить может ли быть пустым event
    def validate(self, attrs):

        # FIXME
        # test

        # orgs_roles = list(EventOrganization.objects.filter(
        #     event=attrs['event']).values_list('role', flat=True))
        # if orgs_roles.count(constants.EventOrganizationRole.MAIN_ORGANIZER) == 0:
        #     if attrs['role'] == constants.EventOrganizationRole.CO_ORGANIZER:
        #         self.fail("main_org_must_be")
        # else:
        #     if attrs['role'] == constants.EventOrganizationRole.MAIN_ORGANIZER:
        #         self.fail("exceed_main_org_limit")

        return attrs


class EventOrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventOrganization
        fields = ['id', 'role_description', 'role', 'event', 'organization']
        read_only_fields = ['id', "event", 'organization']

    # FIXME
    # Надо отвалидировать случай, когда юзер меняет мейн организатора на не мейн и не остается мейн организатора

####################################################################################################################
# PROFF INTEREST USER SERIALIZER
####################################################################################################################


class CreateProffInterestUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProffInterestUser
        fields = ['id', 'user', 'proff_interest']
        read_only_fields = ['id', 'user']

        extra_kwargs = {'proff_interest': {'required': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        return ProffInterestUser.objects.get_or_create(user=user, proff_interest=validated_data['proff_interest'])[0]


class ProffInterestUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProffInterestUser
        fields = ['id', 'user', 'proff_interest']
        read_only_fields = ['id', 'user', 'proff_interest']

        extra_kwargs = {'proff_interest': {'required': True}}

####################################################################################################################
# ACADEMICTITLE USER SERIALIZER
####################################################################################################################


class CreateAcademicTitleUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicTitleUser
        fields = ['id', 'user', 'academic_title']
        read_only_fields = ['id', 'user']

        extra_kwargs = {'academic_title': {'required': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        return AcademicTitleUser.objects.get_or_create(user=user, academic_title=validated_data['academic_title'])[0]


class AcademicTitleUserSerializerSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicTitleUser
        fields = ['id', 'user', 'academic_title']
        read_only_fields = ['id', 'user', 'academic_title']

        extra_kwargs = {'academic_title': {'required': True}}

####################################################################################################################
# AFFILIATION SERIALIZER
####################################################################################################################


class CreateAffiliationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Affiliation
        fields = ['id', 'position', 'user',
                  'organization', 'is_main_affiliation']
        read_only_fields = ['id', 'user']

    # FIXME
    # test

    # validate is_main_affiliation
    def create(self, validated_data):
        validated_data["user"] = self.context['request'].user
        return super().create(validated_data)


class AffiliationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Affiliation
        fields = ['id', 'position', 'organization',
                  'user', 'is_main_affiliation']
        read_only_fields = ['id', 'user', 'organization']

    # FIXME
    # validate is_main_affiliation

####################################################################################################################
# EVENT PARTICIPATION SERIALIZER
####################################################################################################################


class CreateEventParticipationSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventParticipation
        fields = ['id', 'role', 'user', 'event']
        read_only_fields = ['id', 'user']
        extra_kwargs = {'event': {'required': True},
                        'role': {'required': True}, }

    # FIXME
    # на будущее можно сделать user writable
    # и позволять организаторам указывать не свои user_id
    # то есть нужно будет валидировать user_id

    # FIXME
    # надо запретить создавать больше одной роли

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.is_event_organizer(event=attrs['event']):
            if attrs['role'] == constants.EventRole.ORGANIZER:
                raise exceptions.PermissionDenied(
                    "Only organizers of event can appoint somebody as ORGANIZER")
        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context['request'].user
        return super().create(validated_data)


class EventParticipationSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventParticipation
        fields = ['id', 'role', 'user', 'event']
        read_only_fields = ['id', 'user', 'event']

####################################################################################################################
# STATUSCHANGED RECORD SERIALIZERS
####################################################################################################################


class UserStatusChangedRecordSerializer(serializers.ModelSerializer):

    user = serializers.PrimaryKeyRelatedField(
        source='object_id', read_only=True)

    class Meta:
        model = StatusChangedRecord
        fields = ['id', 'previous_status', 'current_status',
                  'timestamp', 'causer', 'comment', 'user']


class EventStatusChangedRecordSerializer(serializers.ModelSerializer):

    event = serializers.PrimaryKeyRelatedField(
        source='object_id', read_only=True)

    class Meta:
        model = StatusChangedRecord
        fields = ['id', 'previous_status', 'current_status',
                  'timestamp', 'causer', 'comment', 'event']

####################################################################################################################
# DICTIONARIES
####################################################################################################################


class RegionalBranchSerializer(serializers.ModelSerializer):

    class Meta:
        model = RegionalBranch
        fields = ['id', 'title', 'chairman', 'address', 'phone_number']
        read_only_fields = ['id']


class ProffInterestSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProffInterest
        fields = ['id', 'title']
        read_only_fields = ['id']


class AcademicTitleSerializer(serializers.ModelSerializer):

    class Meta:
        model = AcademicTitle
        fields = ['id', 'title']
        read_only_fields = ['id']


# class UserCreateAffiliationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Affiliation
#         fields = ['id', 'position', 'is_main_affiliation', 'organization']


# class UserCreateOrganizationSerializer(serializers.ModelSerializer):

#     position = serializers.CharField(max_length=127, required=False)
#     is_main_affiliation = serializers.BooleanField()
#     class Meta:
#         model = Organization
#         fields = ['title', 'position', 'is_main_affiliation']


# class UserCreatePasswordRetypeSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(style={"input_type": "password"}, write_only=True)
#     re_password = serializers.CharField(style={"input_type": "password"}, write_only=True)

#     affiliations = UserCreateAffiliationSerializer(many=True, write_only=True, required=False)
#     organizations = UserCreateOrganizationSerializer(many=True, write_only=True, required=False)

#     default_error_messages = {
#         "cannot_create_user": "Unable to create account.",
#         "password_mismatch": "password_mismatch"
#     }


#     class Meta:
#         model = User
#         fields = ['id', 'first_name', 'password', 're_password', 'last_name', 'patronymic', 'birthday',
#             'email', 'phone_number', 'academic_rank',
#             'regional_branch', 'academic_titles', 'proff_interests', 'affiliations', 'organizations', 'avatar', 'status'
#         ]
#         read_only_fields = ["id", "avatar", "status"]

#     def validate(self, attrs):


#         re_password = attrs.pop("re_password")
#         password = attrs.get("password")
#         if not password == re_password:
#             self.fail("password_mismatch")

#         user = User(email=attrs['email'])


#         try:
#             validate_password(password, user)
#         except django_exceptions.ValidationError as e:
#             serializer_error = serializers.as_serializer_error(e)
#             raise serializers.ValidationError(
#                 {"password": serializer_error[api_settings.NON_FIELD_ERRORS_KEY]}
#             )


#         affiliations_data = attrs.get("affiliations")
#         organizations_data = attrs.get("organizations")
#         main_affiliation_N = 0
#         if affiliations_data is not None:
#             main_affiliation_N += [aff_data["is_main_affiliation"] for aff_data in affiliations_data].count(True)
#         if organizations_data is not None:
#             main_affiliation_N += [org_data["is_main_affiliation"] for org_data in organizations_data].count(True)
#         if main_affiliation_N != 1:
#             raise serializers.ValidationError("Number of main affiliations is not equal to 1")

#         return attrs


#     def create(self, validated_data):
#         try:
#             user = self.perform_create(validated_data)
#         except IntegrityError:
#             self.fail("cannot_create_user")

#         return user


#     @transaction.atomic
#     def perform_create(self, validated_data):

#         affiliations_data = validated_data.pop("affiliations", None)
#         organizations_data = validated_data.pop("organizations", None)

#         academic_titles = validated_data.pop("academic_titles", None)
#         proff_interests = validated_data.pop("proff_interests", None)

#         ava = Avatar.objects.create()
#         user = User.objects.create_user(**validated_data, status=constants.StatusCode.DISAPPROVED, avatar=ava)

#         if organizations_data is not None:
#             self.perform_create_organizations(organizations_data, user)

#         if affiliations_data is not None:
#             self.perform_create_affiliations(affiliations_data, user)

#         if academic_titles is not None:
#             user.academic_titles.set(academic_titles)

#         if proff_interests is not None:
#             user.proff_interests.set(proff_interests)

#         return user


#     def perform_create_organizations(self, organizations_data, user):
#         for org_data in organizations_data:
#             org = Organization.objects.create(title=org_data['title'])
#             Affiliation.objects.create(
#                 organization=org,
#                 user=user,
#                 is_main_affiliation=org_data['is_main_affiliation'],
#                 position=org_data['position'],
#             )


#     def perform_create_affiliations(self, affiliations_data, user):
#         for aff_data in affiliations_data:
#             Affiliation.objects.create(**aff_data, user=user)
