import hashlib

from django.shortcuts import render, get_object_or_404
from django.views.generic.list import ListView
from .forms import UploadForm
from .models import UploadImage
from django.urls import reverse_lazy
from django.views.generic.edit import DeleteView

class index(ListView):
    model = UploadImage
    context_object_name = 'items'
    #これを指定することで、htmlのfor文で使うobject_listを変更できる。今回はitems
    template_name = 'imagedb/index.html'

def upload(request):
    params = {
        'title': '画像のアップロード',
        'upload_form': UploadForm(),
        'id': None,
    }

    if (request.method == 'POST'):
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            upload_image = form.save()
            image_url = "." + upload_image.image.url
            with open(image_url, "rb") as f:
                sha256 = hashlib.sha256(f.read()).hexdigest()

            params['id'] = sha256

    return render(request, 'imagedb/upload.html', params)

def image(request, image_id=0):

    upload_image = get_object_or_404(UploadImage, id=image_id)

    params = {
        'title': '画像の表示',
        'id': upload_image.id,
        'url': upload_image.image.url
    }

    return render(request, 'imagedb/image.html', params)

class delete(DeleteView):
  model = UploadImage

  success_url = reverse_lazy('imagedb:index')

  template_name = 'imagedb/delete.html'