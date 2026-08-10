from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.plans.models import Plan
from apps.members.models import Member
from apps.epins.models import EPIN
from apps.wallet.models import Wallet, WalletTransaction
from apps.income.models import IncomeTransaction
from apps.income.services import IncomeEngine
from apps.withdrawals.models import Withdrawal
from apps.kyc.models import KYCDocument
from apps.support.models import SupportTicket, TicketMessage
from apps.audit.models import AuditLog
from common.utils import generate_epin_code, generate_member_id

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds complete realistic NMS network tree, plans, wallet transactions, KYC, support, and EPINs'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding rich realistic NMS Database...")

        # 1. Plans
        plan_a, _ = Plan.objects.get_or_create(
            name='Plan A (Standard)',
            defaults={
                'price': 3000.00,
                'description': 'Standard membership plan with ₹500 referral commission & ₹1000 binary pair payout.',
                'referral_bonus': 500.00,
                'binary_pair_payout': 1000.00,
                'daily_capping': 10000.00
            }
        )

        plan_b, _ = Plan.objects.get_or_create(
            name='Plan B (Premium)',
            defaults={
                'price': 2800.00,
                'description': 'Premium membership plan with ₹400 referral commission & ₹800 binary pair payout.',
                'referral_bonus': 400.00,
                'binary_pair_payout': 800.00,
                'daily_capping': 8000.00
            }
        )

        # 2. Super Admin User
        admin_user, admin_created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@nms.com',
                'first_name': 'Alexander',
                'last_name': 'Vance',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if admin_created:
            admin_user.set_password('admin123')
            admin_user.save()

        # 3. Create Network Hierarchy
        # M00001 (Root)
        root_u, _ = User.objects.get_or_create(username='root', defaults={'email': 'root@nms.com', 'first_name': 'Victoria', 'last_name': 'Sterling', 'role': User.Role.MEMBER, 'mobile': '9876543210'})
        root_u.set_password('root123')
        root_u.save()
        m1, _ = Member.objects.get_or_create(member_id='M00001', defaults={'user': root_u, 'full_name': 'Victoria Sterling', 'mobile': '9876543210', 'is_root': True, 'current_plan': plan_a, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.VERIFIED})
        w1, _ = Wallet.objects.get_or_create(member=m1)
        KYCDocument.objects.get_or_create(member=m1, defaults={'document_type': 'PAN', 'document_number': 'ABCDE1234F', 'status': 'VERIFIED', 'admin_remarks': 'Approved by Senior Compliance Officer'})

        # M00002 (Left under M00001)
        u2, _ = User.objects.get_or_create(username='m00002', defaults={'email': 'arthur@nms.com', 'first_name': 'Arthur', 'last_name': 'Pendelton', 'role': User.Role.MEMBER, 'mobile': '9876543211'})
        u2.set_password('pass123')
        u2.save()
        m2, _ = Member.objects.get_or_create(member_id='M00002', defaults={'user': u2, 'full_name': 'Arthur Pendelton', 'mobile': '9876543211', 'sponsor': m1, 'parent': m1, 'position': 'LEFT', 'current_plan': plan_a, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.PENDING})
        w2, _ = Wallet.objects.get_or_create(member=m2)
        KYCDocument.objects.get_or_create(member=m2, defaults={'document_type': 'AADHAAR', 'document_number': '1234-5678-9012', 'status': 'PENDING'})

        # M00003 (Right under M00001)
        u3, _ = User.objects.get_or_create(username='m00003', defaults={'email': 'eleanor@nms.com', 'first_name': 'Eleanor', 'last_name': 'Vance', 'role': User.Role.MEMBER, 'mobile': '9876543212'})
        u3.set_password('pass123')
        u3.save()
        m3, _ = Member.objects.get_or_create(member_id='M00003', defaults={'user': u3, 'full_name': 'Eleanor Vance', 'mobile': '9876543212', 'sponsor': m1, 'parent': m1, 'position': 'RIGHT', 'current_plan': plan_b, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.VERIFIED})
        w3, _ = Wallet.objects.get_or_create(member=m3)
        KYCDocument.objects.get_or_create(member=m3, defaults={'document_type': 'PAN', 'document_number': 'XYZPS9876K', 'status': 'VERIFIED', 'admin_remarks': 'Verified against Tax registry'})

        # M00004 (Left under M00002)
        u4, _ = User.objects.get_or_create(username='m00004', defaults={'email': 'charles@nms.com', 'first_name': 'Charles', 'last_name': 'Kingsley', 'role': User.Role.MEMBER, 'mobile': '9876543213'})
        u4.set_password('pass123')
        u4.save()
        m4, _ = Member.objects.get_or_create(member_id='M00004', defaults={'user': u4, 'full_name': 'Charles Kingsley', 'mobile': '9876543213', 'sponsor': m2, 'parent': m2, 'position': 'LEFT', 'current_plan': plan_a, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.VERIFIED})
        w4, _ = Wallet.objects.get_or_create(member=m4)

        # M00005 (Right under M00002)
        u5, _ = User.objects.get_or_create(username='m00005', defaults={'email': 'beatrice@nms.com', 'first_name': 'Beatrice', 'last_name': 'Montague', 'role': User.Role.MEMBER, 'mobile': '9876543214'})
        u5.set_password('pass123')
        u5.save()
        m5, _ = Member.objects.get_or_create(member_id='M00005', defaults={'user': u5, 'full_name': 'Beatrice Montague', 'mobile': '9876543214', 'sponsor': m2, 'parent': m2, 'position': 'RIGHT', 'current_plan': plan_b, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.PENDING})
        w5, _ = Wallet.objects.get_or_create(member=m5)

        # M00006 (Left under M00003)
        u6, _ = User.objects.get_or_create(username='m00006', defaults={'email': 'gideon@nms.com', 'first_name': 'Gideon', 'last_name': 'Cross', 'role': User.Role.MEMBER, 'mobile': '9876543215'})
        u6.set_password('pass123')
        u6.save()
        m6, _ = Member.objects.get_or_create(member_id='M00006', defaults={'user': u6, 'full_name': 'Gideon Cross', 'mobile': '9876543215', 'sponsor': m3, 'parent': m3, 'position': 'LEFT', 'current_plan': plan_a, 'status': Member.Status.ACTIVE, 'kyc_status': Member.KYCStatus.VERIFIED})
        w6, _ = Wallet.objects.get_or_create(member=m6)

        # 4. Trigger Referrals & Binary Income
        IncomeEngine.process_referral_income(m2)
        IncomeEngine.process_referral_income(m3)
        IncomeEngine.process_referral_income(m4)
        IncomeEngine.process_referral_income(m5)
        IncomeEngine.process_referral_income(m6)

        IncomeEngine.calculate_binary_pair_income(m1)
        IncomeEngine.calculate_binary_pair_income(m2)

        # 5. Withdrawals
        Withdrawal.objects.get_or_create(
            id=101,
            defaults={
                'member': m1,
                'amount': 1500.00,
                'status': 'PENDING',
                'bank_account_no': '987654321098',
                'ifsc_code': 'SBIN0004321',
                'upi_id': 'victoria@upi'
            }
        )

        Withdrawal.objects.get_or_create(
            id=102,
            defaults={
                'member': m3,
                'amount': 800.00,
                'status': 'APPROVED',
                'bank_account_no': '112233445566',
                'ifsc_code': 'HDFC0001234',
                'upi_id': 'eleanor@bank',
                'admin_notes': 'Bank transfer confirmed by treasury department'
            }
        )

        # 6. EPINs
        for p in [plan_a, plan_b]:
            for i in range(4):
                code = f"GOLD-{p.id}{i+1:02d}-8842-{i*7:02d}"
                EPIN.objects.get_or_create(
                    code=code,
                    defaults={'plan': p, 'created_by': admin_user, 'status': 'UNUSED'}
                )

        # 7. Support Tickets
        t1, _ = SupportTicket.objects.get_or_create(
            id=201,
            defaults={
                'member': m2,
                'subject': 'KYC Verification Status Query',
                'category': 'KYC',
                'status': 'OPEN'
            }
        )
        TicketMessage.objects.get_or_create(ticket=t1, sender=u2, defaults={'message': 'Greetings, I submitted my Aadhaar document yesterday. Could you kindly provide an update on verification status?'})

        # 8. Audit Logs
        AuditLog.objects.get_or_create(
            action='SEED_SYSTEM_INITIALIZATION',
            defaults={
                'user': admin_user,
                'target_model': 'SYSTEM',
                'target_id': '0',
                'details': 'System initialized with Root Leader M00001 and 6 Member binary hierarchy',
                'ip_address': '127.0.0.1'
            }
        )

        self.stdout.write(self.style.SUCCESS("NMS Database seeded with rich multi-level realistic network dataset!"))
