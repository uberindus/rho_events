from events.models import AcademicTitle, Affiliation, Event, EventOrganization, AcademicTitleUser, ProffInterest, ProffInterestUser, StatusChangedRecord, User
from events import constants
from django.contrib.contenttypes.models import ContentType

class EventService:

    def __init__(self, user=None):
        self.user = user

    def filter_permitted(self):
        permitted = Event.objects.none()
        if self.user.is_authenticated:
            if self.user.is_moderator:
                permitted |= Event.objects.all()
            else:
                permitted |= Event.objects.filter_by_organizer(self.user)
                permitted |= Event.objects.filter_by_reporter(self.user)

        permitted |= Event.objects.filter(status=constants.StatusCode.APPROVED)
    
        return permitted



class EventOrganizationService:

    def __init__(self, user=None):
        self.user = user

    def filter_permitted(self):
        permitted_events = EventService(user=self.user).filter_permitted()
        return EventOrganization.objects.filter(event__in=permitted_events)


class UserRelatedService:

    model = None

    def __init__(self, user=None):
        self.user = user

    def filter_permitted(self):
        permitted = self.model.objects.none()
        if self.user.is_authenticated:
            if self.user.is_moderator:
                permitted |= self.model.objects.all()
            else:
                permitted |= self.model.objects.filter(user=self.user)
        
        return permitted


class AffiliationService(UserRelatedService):
    model = Affiliation

class AcademicTitleUserService(UserRelatedService):
    model = AcademicTitleUser
 
class ProffInterestUserService(UserRelatedService):
    model = ProffInterestUser
   

class UserStatusChangedRecordService:

    def __init__(self, user=None):
        self.user = user


    def filter_permitted(self):
        permitted = StatusChangedRecord.objects.none()
        if self.user.is_authenticated:
            user_content_type = ContentType.objects.get_for_model(User)
            if self.user.is_moderator:
                permitted |= StatusChangedRecord.objects.filter(content_type=user_content_type.pk)
            else:
                permitted |= StatusChangedRecord.objects.filter(object_id=self.user.id, content_type=user_content_type.id)

        return permitted


class EventStatusChangedRecordService:

    def __init__(self, user=None):
        self.user = user

    def filter_permitted(self):
        permitted = StatusChangedRecord.objects.none()
        if self.user.is_authenticated:
            event_content_type = ContentType.objects.get_for_model(Event)
            if self.user.is_moderator:
                permitted |= StatusChangedRecord.objects.filter(content_type=event_content_type)
            else:
                permitted_events = EventService(user=self.user).filter_permitted()
                permitted |= StatusChangedRecord.objects.filter(object_id__in=permitted_events, content_type=event_content_type)

        return permitted