import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Dashboard.css";


const App = () => {
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    supplier: "",
    expiration_date: "",
    threshold: "",
  });
  const [selectedProduct, setselectedProduct] = useState(null);
  const [toView, setToView] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: "",
    supplier: "",
    expiration_date: "",
    threshold: "",
  });
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = () => {
    axios
      .get("http://127.0.0.1:8000/api/product/")
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };
  // Add new product function
  const handleAddProduct = () => {
    axios
      .post("http://127.0.0.1:8000/api/product/", newProduct)
      .then((response) => {
        setProduct([...product, response.data]);
        setNewProduct({
          name: "",
          sku: "",
          quantity: "",
          price: "",
          supplier: "",
          expiration_date: "",
          threshold: "",
        });
      })
      .catch((error) => console.error("Error adding product:", error));
  };
  const handleUpdateProduct = (id) => {
    if (selectedProduct) {
      axios
        .put(
          `http://127.0.0.1:8000/api/product/${selectedProduct.id}/`,
          newProduct
        )
        .then((response) => {
          fetchProduct();
          setNewProduct({
            name: "",
            sku: "",
            quantity: "",
            price: "",
            supplier: "",
            expiration_date: "",
            threshold: "",
          });
        })
        .catch((error) => console.error("Error updating product:", error));
    }
  };

  // Cancel update function
  const handleCancelUpdateProduct = () => {
    setselectedProduct(null);
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

  const handleViewClick = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/product/${id}/`
      );
      setToView(response.data);
      setOpenView(true); // Note: it's setOpenView, not setOpenview
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleEditClick = (product) => {
    setselectedProduct(product);
    setNewProduct(product);
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/product/${id}/`)
      .then((response) => {
        fetchProduct();
        setNewProduct({
          name: "",
          sku: "",
          quantity: "",
          price: "",
          supplier: "",
          expiration_date: "",
          threshold: "",
        });
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  return (
    <div className="app-container">
      <h1>Product Management System</h1>

      {/* Form Container */}
      <div className="form-container">
        <div className="form-inputs">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="supplier"
            placeholder="Supplier"
            value={newProduct.supplier}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="expiration_date"
            placeholder="Expiration Date"
            value={newProduct.expiration_date}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="threshold"
            placeholder="Threshold"
            value={newProduct.threshold}
            onChange={handleInputChange}
          />
          <div className="form-buttons">
            {selectedProduct ? (
              <>
                <button onClick={handleUpdateProduct}>Update</button>
                <button onClick={handleCancelUpdateProduct}>Cancel</button>
              </>
            ) : (
              <button onClick={handleAddProduct}>Add New Product</button>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <ul className="product-list">
        {product.map((prod) => (
          <li key={prod.id}>
            <div>
              <strong>{prod.name}</strong> - SKU: {prod.sku}
            </div>
            <div className="actions">
              <button className="view" onClick={() => handleViewClick(prod.id)}>
                View
              </button>
              <button className="edit" onClick={() => handleEditClick(prod)}>
                Edit
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteProduct(prod.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Single View */}
      {openView && (
        <>
          <div className="outer-box">
            <strong>{toView.name}</strong>
            <br />
            <span>SKU: {toView.sku}</span>
            <br />
            <span>Quantity: {toView.quantity}</span>
            <br />
            <span>Price: ${toView.price}</span>
            <br />
            <span>Supplier: {toView.supplier}</span>
            <br />
            <span>Expiration Date: {toView.expiration_date}</span>
            <br />
            <span>Threshold: {toView.threshold}</span>
            <br />
          </div>
          <button onClick={() => setOpenView(false)}>Close</button>
        </>
      )}
    </div>
  );
};

export default App;
