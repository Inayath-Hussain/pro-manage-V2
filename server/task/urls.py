from django.urls import path
from .views import GetAllUserTasks, CreateNewTask, UpdateTask, UpdateTaskStatus

urlpatterns = [
    path('', GetAllUserTasks.as_view(), name='get-all-user-tasks'),
    path('new/', CreateNewTask.as_view(), name='create-new-task'),
    path('<int:task_id>/', UpdateTask.as_view(), name='update-task'),
    path('<int:task_id>/status/', UpdateTaskStatus.as_view(), name='update-task-status'),
]