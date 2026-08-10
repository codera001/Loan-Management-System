from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth import logout
from django.contrib import messages

def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
         if request.user.is_authenticated:
           return redirect('cms:index')
         else:
           return view_func(request, *args, **kwargs)
    return wrapper_func
    
def allowed_users(allowed_roles=[]):
   def decorator_func(view_func):
       def wrapper_func(request, *args, **kwargs):  
        group = None
        if request.user.groups.exists():
                group = request.user.groups.first().name
                print(group)
        if group in allowed_roles:
           return view_func(request, *args, **kwargs)
        messages.error(
                request,
                "You have not yet been assigned a role. Please contact an administrator."
            )
        logout(request)
        return redirect('cms:login')
       return wrapper_func
   return decorator_func

