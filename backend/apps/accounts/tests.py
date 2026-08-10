from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.plans.models import Plan
from apps.members.models import Member
from apps.epins.models import EPIN
from apps.income.services import IncomeEngine
from common.utils import generate_epin_code

User = get_user_model()

class NMSSystemTestCase(TestCase):
    def setUp(self):
        self.plan = Plan.objects.create(
            name='Test Plan',
            price=3000.00,
            referral_bonus=500.00,
            binary_pair_payout=1000.00
        )
        self.admin = User.objects.create_superuser('admin', 'admin@test.com', 'admin123')
        self.root_user = User.objects.create_user('root', 'root@test.com', 'root123', role='MEMBER')
        self.root_member = Member.objects.create(
            user=self.root_user,
            member_id='M00001',
            full_name='Root Leader',
            mobile='9999999999',
            is_root=True,
            current_plan=self.plan,
            status=Member.Status.ACTIVE
        )

    def test_epin_generation_and_validation(self):
        code = generate_epin_code(prefix="TEST")
        epin = EPIN.objects.create(code=code, plan=self.plan, created_by=self.admin)
        self.assertEqual(epin.status, EPIN.Status.UNUSED)
        self.assertEqual(epin.plan.price, 3000.00)

    def test_member_registration_and_referral_payout(self):
        code = generate_epin_code(prefix="TEST")
        epin = EPIN.objects.create(code=code, plan=self.plan, created_by=self.admin)

        new_user = User.objects.create_user('m00002', 'm2@test.com', 'pass123', role='MEMBER')
        new_member = Member.objects.create(
            user=new_user,
            member_id='M00002',
            full_name='Second Member',
            mobile='8888888888',
            sponsor=self.root_member,
            parent=self.root_member,
            position='LEFT',
            current_plan=self.plan
        )

        income_tx = IncomeEngine.process_referral_income(new_member)
        self.assertIsNotNone(income_tx)
        self.assertEqual(income_tx.amount, 500.00)
        self.assertEqual(income_tx.member, self.root_member)
