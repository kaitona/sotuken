from django.db import models

# Create your models here.
image = models.ImageField(
    upload_to='files/',
    verbose_name='添付画像',
    height_field='url_height',
    width_field='url_width',
)

url_height = models.IntegerField(
    editable=False,
)

url_width = models.IntegerField(
    editable=False,
)