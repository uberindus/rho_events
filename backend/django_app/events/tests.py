from django.http.response import JsonResponse
from rest_framework.test import APITestCase
from events.models import *
from events import constants

class TestUserCreate(APITestCase):
    url = '/api/users/'

    @classmethod
    def setUpTestData(cls):

        cls.org_Cber = Organization.objects.create(title="Cber")
        cls.org_Magnit = Organization.objects.create(title="Magnit")

        cls.proff_int_diving = ProffInterest.objects.create(title="diving")
        cls.proff_int_math = ProffInterest.objects.create(title="math")

        cls.academic_title_med_phd = AcademicTitle.objects.get(title="доктор медицинских наук")
        cls.academic_title_chm_phd = AcademicTitle.objects.get(title="доктор химических наук")

        cls.disapproved_status = constants.StatusCode.DISAPPROVED
        cls.regional_branch_altay = RegionalBranch.objects.get(title="Алтайское")
        

    def test_fullfilled_request(self):

        data = {
            "email": "eldar@foobar.com",
            "first_name": "Eldar",
            "last_name": "Enin",
            "patronymic": "Vasin",
            "password": "Misha33work",
            "re_password": "Misha33work",
            "phone_number": "+79534042354",
            "birthday": "2000-05-20",
            "regional_branch": self.regional_branch_altay.pk,
            "academic_rank": User.AcademicRank.PROFESSOR,
            "organizations": [
                {
                    "title": "HSE",
                    "position": "devops",
                    "is_main_affiliation": False,
                },
                {
                    "title": "MSE",
                    "position": "admin",
                    "is_main_affiliation": False,
                }
            ],
            "affiliations": [
                {
                    "position": "teacher",
                    "is_main_affiliation": True,
                    "organization": self.org_Cber.pk
                },
                {
                    "position": "bodyguard",
                    "is_main_affiliation": False,
                    "organization": self.org_Magnit.pk
                }
            ],
            "proff_interests": [self.proff_int_diving.pk, self.proff_int_math.pk],
            "academic_titles": [self.academic_title_med_phd.pk, self.academic_title_chm_phd.pk]
        }

        response = self.client.post(self.url, data, format='json')
        u = User.objects.get(email=data['email'])
        
        # base_data

        self.assertEqual(u.first_name, data["first_name"])
        self.assertEqual(u.last_name, data["last_name"])
        self.assertEqual(u.patronymic, data["patronymic"])

        self.assertIsNotNone(u.avatar)
        
        self.assertEqual(u.status, self.disapproved_status)

        u_cber_affil = u.affiliations.get(organization=self.org_Cber) 
        self.assertEqual(u_cber_affil.is_main_affiliation, True) 


        # orgs

        last_two_orgs = Organization.objects.all().order_by('-id')[:2]

        self.assertEqual(last_two_orgs[0].title, data["organizations"][1]["title"])
        self.assertEqual(last_two_orgs[1].title, data["organizations"][0]["title"])

        self.assertTrue(u.affiliations.filter(organization=last_two_orgs[1]).exists())
        self.assertTrue(u.affiliations.filter(organization=last_two_orgs[0]).exists())

        # response
        self.assertDictEqual(
            response.data, 
            {
                "id": 2,
                "email": "eldar@foobar.com",
                "first_name": "Eldar",
                "last_name": "Enin",
                "patronymic": "Vasin",
                "phone_number": "+79534042354",
                "birthday": "2000-05-20",
                "avatar": u.avatar.pk,
                "regional_branch": self.regional_branch_altay.pk,
                "academic_rank": User.AcademicRank.PROFESSOR,
                'academic_titles': [14, 16],
                'proff_interests': [6, 7],
                'status': StatusCode.DISAPPROVED
            }
        )