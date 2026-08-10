from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404
from .models import Customer, Loan, Repayment
from django.forms import inlineformset_factory
from .forms import CreateUserForm
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from .decorators import unauthenticated_user, allowed_users
from rest_framework import viewsets, generics
from .serializers import CustomerSerializer, LoanSerializer, RepaymentSerializer, RegisterSerializer

# Create your views here.
# serializers
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status')
        if status:
            return Loan.objects.filter(status=status)
        return Loan.objects.all()


class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer







    
# register new user
# @unauthenticated_user
# def registerPage(request):

#     form = CreateUserForm()
#     if request.method == 'POST':
#         form = CreateUserForm(request.POST)

#         if form.is_valid():
#             form.save()

#             user = form.cleaned_data.get('username')
#             messages.success(request, 'Account was created for ' + user)

#             return redirect('cms:login')   # ✅ redirect ONLY after success

#     context = {'form': form}
#     return render(request, 'accounts/register.html', context)


# login user
# @unauthenticated_user
# def loginPage(request):

#        form = AuthenticationForm()
#        if request.method == 'POST':
#         form = AuthenticationForm(request, data=request.POST)

#         if form.is_valid():
#             user = form.get_user()   # ✅ already authenticated
#             login(request, user)
#             return redirect('cms:index')
#         else:
#             messages.error(request, 'Invalid username or password')

#     # ✅ ALWAYS RETURN THIS
#        return render(request, 'accounts/login.html', {'form': form})

# logout user
# def logoutUser(request):
#     logout(request)
#     return redirect('cms:login')

# get customers and display them
# @login_required(login_url= 'cms:login')
# @allowed_users(allowed_roles=['Relationship Manager', 'Credit Officer', 'Branch Manager', 'admin'])
# def index(request):
#     customer_list = Customer.objects.order_by('joined_at')
#     context = {'customer_list': customer_list}
#     return render(request, 'cms/index.html',context)

# show specific  customer detail
# @login_required(login_url= 'cms:login')
# def detail(request, customer_id):
#   try:
#      customer = Customer.objects.get(pk=customer_id)
#   except Customer.DoesNotExist:
#      raise Http404("Customer does not exist")
#   return render(request, 'cms/c-details.html', {'customer': customer})

# Update specific customer and display their details
# @login_required(login_url= 'cms:login')
# def update(request, customer_id):
#    customer = get_object_or_404(Customer, pk=customer_id)

#    if request.method == 'POST':
#        customer.customers_name = request.POST['customers_name']
#        customer.customers_email = request.POST['customers_email']
#        customer.customers_phone = request.POST['customers_phone']
#        customer.save()
#    return redirect('cms:index')

# add new customer
# @login_required(login_url= 'cms:login')
# def add(request):
#    if request.method == 'POST':
#        customers_name = request.POST.get('customers_name')
#        customers_email = request.POST.get('customers_email')
#        customers_phone = request.POST.get('customers_phone')

#        Customer.objects.create( customers_name = customers_name, customers_email =customers_email, customers_phone = customers_phone)
       
#    return redirect('cms:index')

# delete specific customer
# @login_required(login_url= 'cms:login')
# def delete(request, customer_id):
#     customer = get_object_or_404(Customer, pk=customer_id)

#     if request.method == "POST":
#         customer.delete()
#         return redirect('cms:index')