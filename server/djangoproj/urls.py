from django.contrib import admin
from django.urls import include, path, re_path

from djangoapp.views import react_index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    re_path(r'^(?:dealers|dealer|postreview|login|register)(?:/.*)?$', react_index),
    path('', react_index),
]
