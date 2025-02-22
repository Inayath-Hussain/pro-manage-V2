from rest_framework import serializers
from django.db import transaction

# from .new_task import CreateChecklistSerializer
from ..models import Task, Checklist, PriorityChoices, StatusChoices


class UpdateChecklistSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Checklist
        fields = ['description', 'done', 'id',]

    # def validate_id(self, value):
    #     """Ensure id is an integer if it exists in the request."""

    #     print("validate_id triggered")
    #     if not isinstance(value, int):
    #         raise serializers.ValidationError("ID must be an integer.")
    #     return value


    def to_internal_value(self, data):
        """
        Custom validation for id before DRF converts it.
        Ensures id is an integer if provided.
        """
        
        if 'id' in data and not isinstance(data['id'], int):
            raise serializers.ValidationError({"id": "ID must be an integer."})

        return super().to_internal_value(data)  # Continue normal processing




class UpdateTaskSerializer(serializers.ModelSerializer):
    checklist = UpdateChecklistSerializer(many=True)
    priority = serializers.ChoiceField(choices=PriorityChoices, required=True)
    status = serializers.ChoiceField(choices=StatusChoices, required=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'priority', 'due_date', 'status', 'checklist',]


    def update(self, instance: Task, data):
        with transaction.atomic():
            checklist_data = data.pop('checklist')
            # print(checklist_data)

        ######################################### Update Task ############################################
            instance.title = data.get("title", instance.title)
            instance.due_date = data.get("due_date", instance.due_date)
            instance.priority = data.get("priority", instance.priority)
            instance.status = data.get("status", instance.status)
            instance.save()
        ##################################################################################################


            # get all checklist items of task saved in db ✔
            instance_items = { item.id: item for item in instance.checklist_set.all()}

        ######################################### Checklist Item Updation ########################################
            updated_items = []
            requested_item_ids = []

            for item in checklist_data:
                id = item.get("id", None)
                if not id is None and id in instance_items:
                    instance_items[id].description = item.get('description', instance_items[id].description)
                    instance_items[id].done = item.get('done', instance_items[id].done)
                    updated_items.append(instance_items[id])
                    requested_item_ids.append(id)


            if updated_items:
                Checklist.objects.bulk_update(updated_items, ['description', 'done'])
        ##########################################################################################################




        ######################################### Checklist Item Creation ############################################
            new_checklist_items = [Checklist(**item, task_id =instance.id) for item in checklist_data if not "id" in item]
            if new_checklist_items:
                Checklist.objects.bulk_create(new_checklist_items)
        ###############################################################################################################
            


        ######################################## Checklist Item Deletion ###############################################
            items_to_be_deleted = []
            for key in instance_items.keys():
                if not key in requested_item_ids:
                    items_to_be_deleted.append(key)
            if items_to_be_deleted:
                Checklist.objects.filter(id__in=items_to_be_deleted).delete()
        ###############################################################################################################


            return instance

    
    def validate_checklist(self, data):
        "Custom validation to check atleast 3 checklists are present"

        # print("did this get teiggered")
        if len(data) < 3:
            raise serializers.ValidationError('Must include atleast 3 checklists')
        return data
