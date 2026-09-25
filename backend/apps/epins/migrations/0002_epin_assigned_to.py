import django.db.models.deletion
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('members', '0001_initial'),
        ('epins', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='epin',
            name='assigned_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_epins', to='members.member'),
        ),
    ]
