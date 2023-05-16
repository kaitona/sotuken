from django.db import models

# Create your models here.
class UploadImage(models.Model):
    title = models.CharField(max_length=200)

    description = models.TextField()
    image = models.ImageField(upload_to="images")
    image_hash = models.CharField(max_length=64, default="default")

    def calculate_hash(self):
        # 再計算ロジック
        self.image_hash = self.column1 + self.column2