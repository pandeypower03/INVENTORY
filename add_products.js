const axios = require('axios');

const products = [
    {
        "name": "iPhone 15 Pro",
        "sku": "IP15P",
        "quantity": 25,
        "price": 999.99,
        "supplier": "Apple Inc",
        "expiration_date": "2025-01-17",
        "threshold": 30
    },
    {
        "name": "Samsung Galaxy S23",
        "sku": "SGS23",
        "quantity": 15,
        "price": 899.99,
        "supplier": "Samsung Electronics",
        "expiration_date": "2025-01-17",
        "threshold": 20
    },
    {
        "name": "Sony PlayStation 5",
        "sku": "PS5001",
        "quantity": 5,
        "price": 499.99,
        "supplier": "Sony Interactive",
        "expiration_date": "2025-07-17",
        "threshold": 10
    },
    {
        "name": "MacBook Pro M2",
        "sku": "MBP-M2",
        "quantity": 40,
        "price": 1299.99,
        "supplier": "Apple Inc",
        "expiration_date": "2025-06-17",
        "threshold": 25
    },
    {
        "name": "AirPods Pro",
        "sku": "APP2",
        "quantity": 8,
        "price": 249.99,
        "supplier": "Apple Inc",
        "expiration_date": "2025-01-17",
        "threshold": 15
    },
    {
        "name": "Dell XPS 15",
        "sku": "DXP15",
        "quantity": 12,
        "price": 1599.99,
        "supplier": "Dell Technologies",
        "expiration_date": "2025-06-17",
        "threshold": 15
    },
    {
        "name": "iPad Air",
        "sku": "IPA5",
        "quantity": 3,
        "price": 599.99,
        "supplier": "Apple Inc",
        "expiration_date": "2025-01-17",
        "threshold": 20
    },
    {
        "name": "Nintendo Switch OLED",
        "sku": "NSW-OLED",
        "quantity": 18,
        "price": 349.99,
        "supplier": "Nintendo",
        "expiration_date": "2025-07-17",
        "threshold": 25
    },
    {
        "name": "LG OLED TV",
        "sku": "LG-OLED65",
        "quantity": 7,
        "price": 1999.99,
        "supplier": "LG Electronics",
        "expiration_date": "2025-06-17",
        "threshold": 10
    },
    {
        "name": "Bose QuietComfort",
        "sku": "BQC45",
        "quantity": 4,
        "price": 329.99,
        "supplier": "Bose Corporation",
        "expiration_date": "2025-01-17",
        "threshold": 12
    }
];

async function addProducts() {
    for (const product of products) {
        try {
            await axios.post('http://127.0.0.1:8000/api/product/', product);
            console.log(`Added product: ${product.name}`);
        } catch (error) {
            console.error(`Error adding ${product.name}:`, error.message);
        }
    }
}

addProducts();
