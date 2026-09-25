from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wallettransaction',
            name='category',
            field=models.CharField(choices=[('REFERRAL', 'Referral Commission'), ('BINARY', 'Binary Pair Income'), ('BONUS', 'Milestone Bonus'), ('WITHDRAWAL', 'Withdrawal Debit'), ('WITHDRAWAL_REFUND', 'Withdrawal Refund'), ('ADJUSTMENT', 'System Adjustment'), ('EPIN_PURCHASE', 'EPIN Purchase')], max_length=20),
        ),
    ]
