from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):
    
    class PriorityChoices(models.TextChoices):
        HIGH = "high", "HIGH"
        MODERATE = "moderate", "MODERATE"
        LOW = "low", "LOW"

    
    class StatusChoices(models.TextChoices):
        BACKLOG = "backlog", "BACKLOG"
        IN_PROGRESS = "in-progress", "IN-PROGRESS"
        TO_DO = "to-do", "TO-DO"
        DONE = "done", "DONE"


    
    title = models.CharField(255)
    due_date = models.DateField()
    priority = models.CharField(
        choices=PriorityChoices,
        default=PriorityChoices.HIGH
    )
    status = models.CharField(
        choices=StatusChoices,
        default=StatusChoices.TO_DO
    )
    created_at = models.DateField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    



class Checklist(models.Model):
    description = models.TextField()
    done = models.BooleanField(default=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)