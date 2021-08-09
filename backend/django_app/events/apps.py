from django.apps import AppConfig
from django.dispatch import receiver
from djoser.signals import user_registered


class EventsConfig(AppConfig):
    name = 'events'

    def ready(self) -> None:
        @receiver(user_registered)
        def handle_user_registered(sender, **kwargs):
            pass
            # send email to all moderators    
            # I should create group of moderators