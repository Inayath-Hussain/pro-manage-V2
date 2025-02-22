from rest_framework import serializers
from ..models import Task, Checklist


class CreateChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = ['description', 'done',]


class CreateNewTaskSerializer(serializers.ModelSerializer):
    checklist = CreateChecklistSerializer(many=True)

    class Meta:
        model = Task
        fields = ['title', 'due_date', 'priority', 'checklist',]

    
    def create(self, validated_data):
        user = validated_data.get('user')
        checklist = self.validated_data.pop('checklist')
        task_obj = Task.objects.create(**self.validated_data, user_id=user)
        checklist_objs = Checklist.objects.bulk_create([Checklist(task=task_obj, **item) for item in checklist])

        return {**task_obj.__dict__, "checklist_set": checklist_objs}
    
    
    def validate_checklist(self, data):
        "Custom validation to check atleast 3 checklists are present"

        if len(data) < 3:
            raise serializers.ValidationError('Must include atleast 3 checklists')
        return data
    

