import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Dashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    inStock: false,
    supplier: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
    loadWishlist();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/product/");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  const saveWishlist = (newWishlist) => {
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      const newWishlist = wishlist.filter((item) => item.id !== product.id);
      saveWishlist(newWishlist);
    } else {
      const newWishlist = [...wishlist, product];
      saveWishlist(newWishlist);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(filters.maxPrice)
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.quantity > 0);
    }

    // Supplier filter
    if (filters.supplier) {
      filtered = filtered.filter((product) =>
        product.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = parseFloat(a.price) - parseFloat(b.price);
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const handleOrder = async () => {
    if (!selectedProduct || orderQuantity <= 0 || orderQuantity > selectedProduct.quantity) {
      alert("Invalid order quantity!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/orders/", {
        product_id: selectedProduct.id,
        quantity: orderQuantity,
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        setShowOrderModal(false);
        setSelectedProduct(null);
        setOrderQuantity(1);
        fetchProducts(); // Refresh products to update quantities
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const openOrderModal = (product) => {
    setSelectedProduct(product);
    setOrderQuantity(1);
    setShowOrderModal(true);
  };

  return (
    <div className="dashboard-container">
      <div className="app-container">
        <div className="header">
          <h1>Inventory Catalog</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="search-filter-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products by name, SKU, or supplier..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Price Range:</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                  />
                  In Stock Only
                </label>
              </div>

              <div className="filter-group">
                <input
                  type="text"
                  name="supplier"
                  placeholder="Filter by supplier"
                  value={filters.supplier}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <select onChange={handleSortChange}>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="quantity-asc">Quantity (Low to High)</option>
                  <option value="quantity-desc">Quantity (High to Low)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${!showWishlist ? "active" : ""}`}
            onClick={() => setShowWishlist(false)}
          >
            All Products
          </button>
          <button
            className={`tab-button ${showWishlist ? "active" : ""}`}
            onClick={() => setShowWishlist(true)}
          >
            Wishlist ({wishlist.length})
          </button>
        </div>

        <div className="products-grid">
          {(showWishlist ? wishlist : filteredProducts).map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Quantity:</strong> {product.quantity}</p>
                <p><strong>Supplier:</strong> {product.supplier}</p>
                {product.quantity <= product.threshold && (
                  <div className="low-stock-warning">Low Stock Alert!</div>
                )}
              </div>
              <div className="product-actions">
                <button
                  className={`wishlist-btn ${
                    wishlist.some((item) => item.id === product.id)
                      ? "in-wishlist"
                      : ""
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  {wishlist.some((item) => item.id === product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
                <button
                  className="order-btn"
                  onClick={() => openOrderModal(product)}
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? "Out of Stock" : "Order Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showOrderModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Place Order</h2>
              <p>Product: {selectedProduct.name}</p>
              <p>Price: ${selectedProduct.price}</p>
              <p>Available Quantity: {selectedProduct.quantity}</p>
              <div className="quantity-input">
                <label>Order Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                />
              </div>
              <p>Total Price: ${(selectedProduct.price * orderQuantity).toFixed(2)}</p>
              <div className="modal-actions">
                <button onClick={handleOrder}>Confirm Order</button>
                <button onClick={() => setShowOrderModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
