from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with ADMIN role or superuser status.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (getattr(request.user, 'role', '') == 'ADMIN' or request.user.is_superuser or request.user.is_staff)
        )

class IsMemberUserRole(permissions.BasePermission):
    """
    Allows access to authenticated users with MEMBER role or ADMIN.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated
        )
