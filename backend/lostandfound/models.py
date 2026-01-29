from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class LostAndFoundItem(models.Model):
    STATUS_CHOICES = (
        ('lost', 'Lost'),
        ('found', 'Found'),
        ('claimed', 'Claimed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    hostel = models.ForeignKey('accounts.Hostel', on_delete=models.CASCADE)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title