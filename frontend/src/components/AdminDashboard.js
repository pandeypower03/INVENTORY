import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FaBox, FaExclamationTriangle, FaClock, FaDollarSign } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    supplier: "",
    expiration_date: "",
    threshold: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    expiringItems: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    calculateStatistics();
  }, [products]);

  const calculateStatistics = () => {
    const currentDate = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const stats = {
      totalProducts: products.length,
      lowStockItems: products.filter(product => product.quantity <= product.threshold).length,
      expiringItems: products.filter(product => {
        const expiryDate = new Date(product.expiration_date);
        return expiryDate <= thirtyDaysFromNow && expiryDate >= currentDate;
      }).length,
      totalValue: products.reduce((total, product) => total + (product.price * product.quantity), 0)
    };

    setStatistics(stats);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/product/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/product/", newProduct);
      fetchProducts();
      setNewProduct({
        name: "",
        sku: "",
        quantity: "",
        price: "",
        supplier: "",
        expiration_date: "",
        threshold: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/product/${selectedProduct.id}/`, newProduct);
      fetchProducts();
      setSelectedProduct(null);
      setNewProduct({
        name: "",
        sku: "",
        quantity: "",
        price: "",
        supplier: "",
        expiration_date: "",
        threshold: "",
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/product/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct(product);
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
    setNewProduct({
      name: "",
      sku: "",
      quantity: "",
      price: "",
      supplier: "",
      expiration_date: "",
      threshold: "",
    });
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setViewProduct(null);
    setShowViewModal(false);
  };

  const downloadCSV = () => {
    const headers = ["Name", "SKU", "Quantity", "Price", "Supplier", "Expiration Date", "Threshold"];
    const csvData = products.map(item => [
      item.name,
      item.sku,
      item.quantity,
      item.price,
      item.supplier,
      item.expiration_date,
      item.threshold
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="app-container">
        <div className="header">
          <h1>Inventory Management System</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="statistics-panel">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>Total Inventory</h3>
              <p>{statistics.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <FaExclamationTriangle />
            </div>
            <div className="stat-content">
              <h3>Low Stock Items</h3>
              <p>{statistics.lowStockItems}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon danger">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>Expiring Soon</h3>
              <p>{statistics.expiringItems}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>Total Value</h3>
              <p>${statistics.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="form-container">
          <h2>{selectedProduct ? "Edit Product" : "Add New Product"}</h2>
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>SKU</label>
                <input
                  type="text"
                  placeholder="Enter SKU"
                  value={newProduct.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newProduct.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  placeholder="Enter supplier name"
                  value={newProduct.supplier}
                  onChange={(e) => handleInputChange("supplier", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Expiration Date</label>
                <input
                  type="date"
                  value={newProduct.expiration_date}
                  onChange={(e) => handleInputChange("expiration_date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Threshold</label>
                <input
                  type="number"
                  placeholder="Enter stock threshold"
                  value={newProduct.threshold}
                  onChange={(e) => handleInputChange("threshold", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              className="add-btn" 
              onClick={selectedProduct ? handleUpdateProduct : handleAddProduct}
            >
              {selectedProduct ? "Update Product" : "Add Product"}
            </button>
            {selectedProduct && (
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <button className="download-btn" onClick={downloadCSV}>
          Download Report (CSV)
        </button>

        <div className="products-container">
          <h2>Product List</h2>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p><strong>SKU:</strong> {product.sku}</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Supplier:</strong> {product.supplier}</p>
                  <p><strong>Expiration:</strong> {product.expiration_date}</p>
                  <p><strong>Threshold:</strong> {product.threshold}</p>
                  {product.quantity <= product.threshold && (
                    <div className="low-stock-warning">Low Stock Alert!</div>
                  )}
                </div>
                <div className="product-actions">
                  <button className="view" onClick={() => handleViewClick(product)}>View</button>
                  <button className="edit" onClick={() => handleEditClick(product)}>Edit</button>
                  <button className="delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showViewModal && viewProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{viewProduct.name}</h2>
                <button className="close-btn" onClick={handleCloseView}>&times;</button>
              </div>
              <div className="modal-body">
                <p><strong>SKU:</strong> {viewProduct.sku}</p>
                <p><strong>Quantity:</strong> {viewProduct.quantity}</p>
                <p><strong>Price:</strong> ${viewProduct.price}</p>
                <p><strong>Supplier:</strong> {viewProduct.supplier}</p>
                <p><strong>Expiration Date:</strong> {viewProduct.expiration_date}</p>
                <p><strong>Threshold:</strong> {viewProduct.threshold}</p>
                {viewProduct.quantity <= viewProduct.threshold && (
                  <div className="low-stock-warning">Low Stock Alert!</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
