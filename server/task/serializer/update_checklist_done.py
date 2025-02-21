from rest_framework import serializers
from ..models import Checklist

class UpdateChecklistDoneSerializer(serializers.ModelSerializer):
    done = serializers.BooleanField(required=True)
    class Meta:
        model = Checklist
        fields = ['done']

    def update(self, instance: Checklist, validated_data):
        instance.done = validated_data.get('done', instance.done)
        instance.save()
        
        return instance