# Generated by Django 3.2.5 on 2023-05-14 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('imagedb', '0003_alter_uploadimage_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='uploadimage',
            name='image_hash',
            field=models.CharField(default='default', max_length=64),
        ),
        migrations.AlterField(
            model_name='uploadimage',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
