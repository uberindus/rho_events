from django.urls import path, include
from rest_framework.routers import DefaultRouter

from events import views

router = DefaultRouter()
router.register("events", views.EventViewSet, "events")
router.register("regional-branches",
                views.RegionalBranchRetrieveList, "regional_branches")
router.register("academic-titles",
                views.AcademicTitleRetrieveList, "academic_titles")
router.register("proff-interests",
                views.ProffInterestRetrieveList, "proff_interests")
router.register("event-organizations",
                views.EventOrganizationViewSet, "event_organizations")
router.register("affiliations", views.AffiliationViewSet, "affiliations")
router.register("event-participations",
                views.EventParticipationViewSet, "event_participations")
router.register("organizations", views.OrganizationViewSet, "organizations")
router.register("academic-titles-users",
                views.AcademicTitleUserViewSet, "academic_titles_users")
router.register("proff-interests-users",
                views.ProffInterestUserViewSet, "proff_interests_users")
router.register("status-changed-records-users",
                views.UserStatusChangedRecordViewSet, "status_changed_records_users")
router.register("status-changed-records-events",
                views.EventStatusChangedRecordViewSet, "status_changed_records_events")

router.register("users", views.UserViewSet, "users")

urlpatterns = [
    path('', include('djoser.urls.authtoken')),
    path('avatars/<int:pk>/', views.AvatarDetail.as_view()),
]

urlpatterns += router.urls
