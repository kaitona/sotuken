from django.shortcuts import render
from .forms import UploadForm
from .models import UploadImage

def index(request):
    return render(request, 'imagedb/index.html')

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

            params['id'] = upload_image.id

    return render(request, 'imagedb/upload.html', params)