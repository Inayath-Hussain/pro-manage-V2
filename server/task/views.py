from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist


# from .serializer.new_task import CreateNewTaskSerializer
# from .serializer.get_task import GetTaskSerializer
# from .serializer.update_task import UpdateTaskSerializer
# from .serializer.update_task_status import UpdateTaskStatusSerializer

from .serializer import CreateNewTaskSerializer, GetTaskSerializer, UpdateTaskSerializer, UpdateTaskStatusSerializer, UpdateChecklistDoneSerializer

from .models import Checklist, Task

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
            return Response({"message": "success"}, status=status.HTTP_200_OK)

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
    


    def delete(self, request:Request, task_id):
        user_id = request.user.id
        try:
            task_obj = Task.objects.get(id=task_id, user=user_id)
            task_obj.delete()
            return Response({"message": "success"}, status=status.HTTP_200_OK)

        except Task.DoesNotExist:
            return Response({"error": "task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class UpdateTaskStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request: Request, task_id):
        user_id = request.user.id

        try:
            print(task_id)
            task_obj = Task.objects.get(id=task_id, user=user_id)
            serializer = UpdateTaskStatusSerializer(task_obj, data=request.data)

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)

        except Task.DoesNotExist:
            return Response({"error": "Task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



class UpdateChecklistItemDone(APIView):
    def patch(self, request: Request, task_id, checklist_id):
        user_id = request.user.id

        try:
            task_obj = Task.objects.get(id=task_id, user=user_id)
            checklist_obj = Checklist.objects.get(id=checklist_id, task=task_obj.id)

            serializer = UpdateChecklistDoneSerializer(checklist_obj, data=request.data)

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)

        except Task.DoesNotExist:
            return Response({"error": "Task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Checklist.DoesNotExist:
            return Response({"error": "checklist item doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class GetTaskPublic(APIView):

    def get(self, request: Request, task_id):
        try:
            task_obj = Task.objects.filter(id=task_id).prefetch_related("checklist_set").first()
            serializer = GetTaskSerializer(task_obj)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        
        except Task.DoesNotExist:
            return Response({"error": "Task doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)
            return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)