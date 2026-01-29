from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Issue(models.Model):
    CATEGORY_CHOICES = (
        ('plumbing', 'Plumbing'),
        ('electrical', 'Electrical'),
        ('cleanliness', 'Cleanliness'),
        ('internet', 'Internet'),
        ('furniture', 'Furniture'),
        ('security', 'Security'),
        ('other', 'Other'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('emergency', 'Emergency'),
    )
    
    STATUS_CHOICES = (
        ('reported', 'Reported'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='reported')
    is_public = models.BooleanField(default=True)
    
    hostel = models.ForeignKey('accounts.Hostel', on_delete=models.CASCADE)
    block = models.CharField(max_length=50)
    room_number = models.CharField(max_length=20)
    
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_issues')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

class IssueComment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.user.username}"
