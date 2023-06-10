from django.db import models

from django.conf import settings
import hashlib 
from django.core.files.storage import default_storage
import os
# Create your models here.
class UploadImage(models.Model):
    title = models.CharField(max_length=200)

    description = models.TextField()
    image = models.ImageField(upload_to="")
    image_hash = models.CharField(max_length=64, default="default")

   
    

    def save(self, *args, **kwargs):
        pass
        print ("create_model")

        super().save(*args, **kwargs)  # Call the "real" save() method.

        image_pass = settings.MEDIA_ROOT + str(self.image)
        print(image_pass)
        with open(image_pass, 'rb') as f:
            sha256 = hashlib.sha256(f.read()).hexdigest()
            print(sha256)
            self.image_hash=sha256


        # 移動元と移動先のファイルパスを取得する
        source_path = default_storage.path(str(self.image.name))
        destination_path = default_storage.path( str(sha256)+".png")

        # os.rename()を使用してファイルを移動する
        os.rename(source_path, destination_path)
        self.image=sha256+".png"


        
        super().save()
            