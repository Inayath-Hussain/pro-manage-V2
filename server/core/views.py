from django.http import JsonResponse

def custom_404_view(request, exception):
    print(exception)
    return JsonResponse({"error": "Not found"}, status=404)

def custom_500_view(request):
    return JsonResponse({"error": "Server error"}, status=500)
