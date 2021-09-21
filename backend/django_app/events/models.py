from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, Group as DjangoGroup, GroupManager as DjangoGroupManager

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

from django.core.exceptions import ObjectDoesNotExist

from events.constants import StatusCode, AcademicRank, MODERATORS_GROUP, EventRole, EventOrganizationRole

from django.core.validators import RegexValidator

#####################################################################################################################
#  STATUS
#####################################################################################################################


class StatusChangedRecord(models.Model):
    previous_status = models.CharField(
        max_length=15, choices=StatusCode.CHOICES, default=StatusCode.REJECTED)
    current_status = models.CharField(
        max_length=15, choices=StatusCode.CHOICES, default=StatusCode.REJECTED)
    timestamp = models.DateTimeField(auto_now_add=True)

    causer = models.ForeignKey(
        "User", null=True, on_delete=models.SET_NULL, related_name="status_changes_records")
    comment = models.CharField(max_length=255, blank=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')


#####################################################################################################################
#  EVENT ORGANIZATION AFFILIATION
#####################################################################################################################

class Organization(models.Model):
    title = models.CharField(max_length=127, unique=True, blank=True)

    def __str__(self) -> str:
        return self.title


class EventManager(models.Manager):

    def filter_by_organizer(self, user):
        return self.filter(participations__user=user, participations__role=EventRole.ORGANIZER)

    def filter_by_reporter(self, user):
        return self.filter(participations__user=user, participations__role=EventRole.REPORTER)


class Event(models.Model):

    objects = EventManager()

    title = models.CharField(max_length=255, blank=True)

    date_begin = models.DateField()
    date_end = models.DateField()
    place = models.CharField(max_length=127, blank=True)

    brief_description = models.CharField(max_length=1023, blank=True)
    full_description = models.CharField(max_length=15000, blank=True)

    site = models.URLField(max_length=127, blank=True)

    status = models.CharField(
        max_length=15, choices=StatusCode.CHOICES, default=StatusCode.PROCESS)

    is_over = models.BooleanField(default=False)

    class Meta:
        ordering = ['date_begin']


class EventOrganization(models.Model):
    role = models.CharField(max_length=15, choices=EventOrganizationRole.CHOICES,
                            default=EventOrganizationRole.MAIN_ORGANIZER)
    role_description = models.CharField(max_length=127, blank=True)
    event = models.ForeignKey(
        Event, null=True, on_delete=models.SET_NULL, related_name="event_organizations")
    organization = models.ForeignKey(
        Organization, null=True, on_delete=models.SET_NULL, related_name="event_organizations")


class Affiliation(models.Model):
    position = models.CharField(max_length=127, blank=True)
    organization = models.ForeignKey(
        Organization, null=True, on_delete=models.SET_NULL, related_name="affiliations")
    user = models.ForeignKey(
        "User", null=True, on_delete=models.SET_NULL, related_name="affiliations")
    is_main_affiliation = models.BooleanField()

#####################################################################################################################
#  GROUP PROXY
#####################################################################################################################


class GroupManager(DjangoGroupManager):

    def get_moderators(self):
        return self.get(name=MODERATORS_GROUP)


class Group(DjangoGroup):

    objects = GroupManager()

    class Meta:
        proxy = True

#####################################################################################################################
#  USER
#####################################################################################################################


class ProffInterest(models.Model):
    title = models.CharField(max_length=127, blank=True)

    def __str__(self) -> str:
        return self.title


class ProffInterestUser(models.Model):
    proff_interest = models.ForeignKey(
        ProffInterest,
        on_delete=models.SET_NULL,
        related_name="users",
        null=True
    )
    user = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        related_name="proff_interests",
        null=True
    )


class RegionalBranch(models.Model):
    title = models.CharField(max_length=63, blank=True, unique=True)
    chairman = models.CharField(max_length=127, blank=True)
    address = models.CharField(max_length=63, blank=True)
    phone_number = models.CharField(max_length=31, blank=True)

    def __str__(self) -> str:
        return self.title


class AcademicTitle(models.Model):
    title = models.CharField(max_length=63, blank=True, unique=True)

    def __str__(self) -> str:
        return self.title


class AcademicTitleUser(models.Model):
    academic_title = models.ForeignKey(
        AcademicTitle,
        on_delete=models.SET_NULL,
        related_name="users",
        null=True
    )
    user = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        related_name="academic_titles",
        null=True
    )


class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, email, password, **extra_fields):
        """`
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


def avatar_photo_path(avatar, filename):
    return f"users/{avatar.user.pk}/{filename}"


class Avatar(models.Model):
    photo = models.ImageField(blank=True, null=True,
                              upload_to=avatar_photo_path)


class User(AbstractUser):

    def get_main_affiliation(self):
        try:
            return Affiliation.objects.get(user=self, is_main_affiliation=True)
        except ObjectDoesNotExist:
            return None

    @property
    def is_moderator(self):
        moderators_group = Group.objects.get_moderators()
        return self.groups.filter(pk=moderators_group.pk).exists()

    def is_event_organizer(self, event):
        return EventParticipation.objects.filter(user=self, event=event, role=EventParticipation.Role.ORGANIZER).exists()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    username = None
    email = models.EmailField('email address', unique=True)

    status = models.CharField(
        max_length=15, choices=StatusCode.CHOICES, default=StatusCode.REJECTED)

    # additional fields of User

    patronymic = models.CharField(max_length=127, blank=True)
    birthday = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=14, blank=True, null=True)

    avatar = models.OneToOneField(
        Avatar, on_delete=models.SET_NULL, null=True, related_name="user")

    # education

    AcademicRank = AcademicRank

    academic_rank = models.CharField(
        max_length=31,
        choices=AcademicRank.CHOICES,
        default=AcademicRank.NOTHING,
    )

    regional_branch = models.ForeignKey(
        RegionalBranch,
        on_delete=models.SET_NULL,
        related_name="users",
        null=True
    )

    def __str__(self):
        return self.email

#####################################################################################################################
#  EVENT_PARTICIPATION
#####################################################################################################################


class EventParticipation(models.Model):

    Role = EventRole

    role = models.CharField(
        max_length=15, choices=Role.CHOICES, default=Role.REPORTER)
    user = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, related_name="events_participation")
    event = models.ForeignKey(
        Event, null=True, on_delete=models.SET_NULL, related_name="participations")


# class Form(models.Model):

#     # user data
#     fullname = models.CharField(max_length=127, blank=True)
#     email = models.EmailField('email address')
#     phone_number = PhoneNumberField()
#     affiliation = models.CharField(max_length=255, blank=True)

#     report_theme = models.CharField(max_length=255, blank=True)

#     user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="users")
#     event = models.ForeignKey(Event, null=True, on_delete=models.SET_NULL, related_name="events")
