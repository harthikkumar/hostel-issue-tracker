from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('caretaker', 'Caretaker'),
        ('management', 'Management'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone_number = models.CharField(max_length=15, blank=True)
    hostel = models.ForeignKey('Hostel', on_delete=models.SET_NULL, null=True, blank=True)
    block = models.CharField(max_length=50, blank=True)
    room_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Hostel(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    address = models.TextField()
    total_blocks = models.IntegerField(default=1)
    total_rooms = models.IntegerField(default=0)
    contact_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name