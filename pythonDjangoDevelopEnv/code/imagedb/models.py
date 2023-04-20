from django.db import models

# Create your models here.
attach = models.FileField(
        upload_to='uploads/%Y/%m/%d/',
        verbose_name='添付ファイル',
        validators=[FileExtensionValidator(['pdf', ])],
    )
