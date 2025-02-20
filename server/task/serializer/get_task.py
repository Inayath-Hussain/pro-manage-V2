from rest_framework.serializers import ModelSerializer
from ..models import Task, Checklist

class GetTaskSerializer(ModelSerializer):
    
    class ChecklistSerializer(ModelSerializer):
        class Meta:
            model = Checklist
            exclude = ('task',)

    class Meta:
        model = Task
        exclude = ('user',)

    checklist = ChecklistSerializer(many=True, source='checklist_set')