from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Announcement(models.Model):
    CATEGORY_CHOICES = (
        ('maintenance', 'Maintenance'),
        ('cleaning', 'Cleaning'),
        ('event', 'Event'),
        ('general', 'General'),
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    hostel = models.ForeignKey('accounts.Hostel', on_delete=models.CASCADE, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title