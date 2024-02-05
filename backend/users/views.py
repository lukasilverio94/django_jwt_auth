from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer
from .models import User
import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_JWT = os.environ.get('SECRET_JWT')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.name
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

#  REGISTER USER


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            # Check the console or log for validation errors
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# LOGIN USER


class LoginView(APIView):
    def post(self, request):
        print("Request received in LoginView")
        email = request.data['email']
        password = request.data['password']

        # Find user
        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found')

        # If goes this line, means the user is found!
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')

        # After import jwt and datetime, set payload:
        payload = {
            'id': user.id,
            'user': user.name,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=3),
            'iat': datetime.datetime.utcnow()
        }

        # Create token
        token = jwt.encode(payload, SECRET_JWT,
                           algorithm='HS256')

        response = Response()

        response.set_cookie(key='jwt', value=token,
                            httponly=True, samesite='Lax')

        # Allow credentials in cross-origin requests
        response["Access-Control-Allow-Credentials"] = "true"
        print("Response: ", response)
        response.data = {
            'jwt': token
        }

        # If goes here, means password is correct
        return response

# AUTHENTICATED USER


class UserView(APIView):
    def get(self, request):
        try:
            token = request.COOKIES.get('jwt')
            print("Received Token: ", token)

            if not token:
                raise AuthenticationFailed('Unauthenticated! No token.')

            try:
                payload = jwt.decode(token, SECRET_JWT, algorithms=['HS256'])
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed('Unauthenticated! Token expired.')

            user = User.objects.filter(id=payload['id']).first()
            print("User: ", user)

            serializer = UserSerializer(user)
            return Response(serializer.data)

        except AuthenticationFailed as e:
            print(f"Authentication Failed: {str(e)}")
            return Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


# LOGOUT


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        # Allow credentials in cross-origin requests
        response["Access-Control-Allow-Credentials"] = "true"
        response.data = {
            'message': 'Success logout'
        }

        return response
