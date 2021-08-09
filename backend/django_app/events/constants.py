#####################################################################################################################
#  GROUP CONSTANTS
#####################################################################################################################

MODERATORS_GROUP = "MODERATORS" 

#####################################################################################################################
#  STATUS CONSTANTS
#####################################################################################################################

class StatusCode:
    DRAFT = 'DRAFT'
    PROCESS = 'PROCESS'
    APPROVED = 'APPROVED'
    DISAPPROVED = 'DISAPPROVED'
    REJECTED = 'REJECTED'
    RETURNED = 'RETURNED'

    CHOICES = [
        (DRAFT, 'Черновик'),
        (PROCESS, 'Отправлено на согласование'),
        (APPROVED, 'Одобрено'),
        (REJECTED, 'Отклонено'),
        (DISAPPROVED, 'Не одобрено'),
        (RETURNED, 'Отправлено на доработку'),
    ]

#####################################################################################################################
#  USER CONSTANTS
#####################################################################################################################


class AcademicRank:
    NOTHING = 'NOTHING'
    ACADEMIC = 'ACADEMIC'
    CORRESPONDING_MEMBER = 'CORRESPONDING_MEMBER'
    PROFESSOR = 'PROFESSOR'
    DOCENT = 'DOCENT'
    
    CHOICES = [
        (NOTHING, 'Без звания'),
        (ACADEMIC, 'Академик'),
        (CORRESPONDING_MEMBER, 'Член-корреспондент'),
        (PROFESSOR, 'Профессор'),
        (DOCENT, 'Доцент'),
    ]

#####################################################################################################################
#  EVENT CONSTANTS
#####################################################################################################################


class EventRole:
    REPORTER = 'REPORTER'
    ORGANIZER = 'ORGANIZER'
    
    CHOICES = [
        (REPORTER, 'докладчик'),
        (ORGANIZER, 'организатор'),
    ]


class EventOrganizationRole:
    MAIN_ORGANIZER = 'MAIN_ORGANIZER'
    CO_ORGANIZER = 'CO_ORGANIZER'
    
    CHOICES = [
        (MAIN_ORGANIZER, 'организатор'),
        (CO_ORGANIZER, 'соорганизатор'),
    ]    
