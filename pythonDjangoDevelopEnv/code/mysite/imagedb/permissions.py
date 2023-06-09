from rest_framework import permissions


class UserPermission(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method.lower() == 'post':
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj) -> bool:
        return obj == request.user