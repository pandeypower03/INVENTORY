from inventory.models import Product
from datetime import datetime, timedelta

# Sample products data
products = [
    {
        "name": "iPhone 15 Pro",
        "sku": "IP15P",
        "quantity": 25,
        "price": 999.99,
        "supplier": "Apple Inc",
        "expiration_date": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%d'),
        "threshold": 30
    },
    {
        "name": "Samsung Galaxy S23",
        "sku": "SGS23",
        "quantity": 15,
        "price": 899.99,
        "supplier": "Samsung Electronics",
        "expiration_date": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%d'),
        "threshold": 20
    },
    {
        "name": "Sony PlayStation 5",
        "sku": "PS5001",
        "quantity": 5,
        "price": 499.99,
        "supplier": "Sony Interactive",
        "expiration_date": (datetime.now() + timedelta(days=1825)).strftime('%Y-%m-%d'),
        "threshold": 10
    },
    {
        "name": "MacBook Pro M2",
        "sku": "MBP-M2",
        "quantity": 40,
        "price": 1299.99,
        "supplier": "Apple Inc",
        "expiration_date": (datetime.now() + timedelta(days=1095)).strftime('%Y-%m-%d'),
        "threshold": 25
    },
    {
        "name": "AirPods Pro",
        "sku": "APP2",
        "quantity": 8,
        "price": 249.99,
        "supplier": "Apple Inc",
        "expiration_date": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%d'),
        "threshold": 15
    },
    {
        "name": "Dell XPS 15",
        "sku": "DXP15",
        "quantity": 12,
        "price": 1599.99,
        "supplier": "Dell Technologies",
        "expiration_date": (datetime.now() + timedelta(days=1095)).strftime('%Y-%m-%d'),
        "threshold": 15
    },
    {
        "name": "iPad Air",
        "sku": "IPA5",
        "quantity": 3,
        "price": 599.99,
        "supplier": "Apple Inc",
        "expiration_date": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%d'),
        "threshold": 20
    },
    {
        "name": "Nintendo Switch OLED",
        "sku": "NSW-OLED",
        "quantity": 18,
        "price": 349.99,
        "supplier": "Nintendo",
        "expiration_date": (datetime.now() + timedelta(days=1825)).strftime('%Y-%m-%d'),
        "threshold": 25
    },
    {
        "name": "LG OLED TV",
        "sku": "LG-OLED65",
        "quantity": 7,
        "price": 1999.99,
        "supplier": "LG Electronics",
        "expiration_date": (datetime.now() + timedelta(days=1095)).strftime('%Y-%m-%d'),
        "threshold": 10
    },
    {
        "name": "Bose QuietComfort",
        "sku": "BQC45",
        "quantity": 4,
        "price": 329.99,
        "supplier": "Bose Corporation",
        "expiration_date": (datetime.now() + timedelta(days=730)).strftime('%Y-%m-%d'),
        "threshold": 12
    }
]

# Add products to database
for product_data in products:
    Product.objects.create(**product_data)

print("Sample products added successfully!")
