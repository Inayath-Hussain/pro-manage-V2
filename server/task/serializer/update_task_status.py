from rest_framework import serializers

from ..models import Task, StatusChoices


class UpdateTaskStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(StatusChoices, required=True)
    
    class Meta:
        model = Task
        fields = ["status",]

    def update(self, instance: Task, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance