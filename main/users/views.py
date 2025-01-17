from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from .models import User
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

class RegisterView(APIView):
    def post(self, request):
        try:
            print("Received data:", request.data)  # Debug print
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': serializer.data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            print("Validation errors:", serializer.errors)  # Debug print
            return Response({
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Error:", str(e))  # Debug print
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        try:
            print("=== Login Request Data ===")
            print(request.data)
            print("=== Content Type ===")
            print(request.content_type)
            
            email = request.data.get('email')
            password = request.data.get('password')

            print(f"Email: {email}")
            print(f"Password provided: {'Yes' if password else 'No'}")

            if not email or not password:
                return Response({
                    'error': 'Please provide both email and password'
                }, status=status.HTTP_400_BAD_REQUEST)

            # First, try to get the user by email
            try:
                user = User.objects.get(email=email)
                print(f"User found: {user.username}")
                
                # Check if password is correct
                if user.check_password(password):
                    print("Password is correct")
                    refresh = RefreshToken.for_user(user)
                    serializer = UserSerializer(user)
                    return Response({
                        'user': serializer.data,
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    print("Password is incorrect")
                    return Response({
                        'error': 'Invalid password'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except User.DoesNotExist:
                print(f"No user found with email: {email}")
                return Response({
                    'error': 'No account found with this email'
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Login failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer