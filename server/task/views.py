from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

from .serializer.new_task import CreateNewTaskSerializer
from .serializer.get_task import GetTaskSerializer
from .serializer.update_task import UpdateTaskSerializer
from .models import Task

# Create your views here.

class GetAllUserTasks(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request: Request):
        # get all user tasks
        
        user_id = request.user.id
        print("user id", user_id)

        tasks_queryset = Task.objects.filter(user=user_id).prefetch_related("checklist_set")
        tasks = GetTaskSerializer(tasks_queryset, many=True)
        
        return Response({"data": tasks.data}, status=status.HTTP_200_OK)



# @method_decorator(csrf_exempt, name="dispatch")
class CreateNewTask(APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request: Request):
        # create new task
        user_id = request.user.id

        serializer = CreateNewTaskSerializer(data=request.data)

        if serializer.is_valid():
            print("data is valid")
            print(serializer.validated_data)

            print("trying to save")
            serializer.save(user=user_id)
            return Response({"message": "valid data"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)





class UpdateTask(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request:Request, task_id):
        user_id = request.user.id
        print(task_id)

        try:
        # get task obj
            task_obj = Task.objects.get(id=task_id, user=user_id)
            # validate data
            serializer = UpdateTaskSerializer(task_obj, data=request.data)
            print("is serializer valid", serializer.is_valid())

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

            serializer.save()

        except ObjectDoesNotExist:
            return Response({"error": "Task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)


        return Response({"message": "dummy"}, status=status.HTTP_200_OK)




