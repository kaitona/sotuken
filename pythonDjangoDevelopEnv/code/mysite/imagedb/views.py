from django.shortcuts import render


def index(request):
    return render(request, 'imagedb/index.html')

def upload(request):
    return render(request, 'imagedb/upload.html')