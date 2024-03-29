# Generated by Django 3.2.5 on 2023-05-13 16:17

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imagedb', '0002_alter_uploadimage_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadimage',
            name='id',
            field=models.CharField(max_length=100, primary_key=True, serialize=False, validators=[django.core.validators.RegexValidator('^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed.')]),
        ),
    ]
