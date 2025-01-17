# Generated by Django 4.2.18 on 2025-01-16 11:17

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_groups_alter_user_user_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('sku', models.CharField(max_length=50, unique=True)),
                ('quantity', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('supplier', models.CharField(max_length=200)),
                ('expiration_date', models.DateField(blank=True, null=True)),
                ('threshold', models.IntegerField(default=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
