import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detect environment and construct API URL
  const getApiUrl = () => {
    // Check if in Codespaces
    if (window.location.hostname.includes('app.github.dev')) {
      // Extract codespace name from current URL
      const match = window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/);
      if (match) {
        const codespaceName = match[1];
        // Construct API Gateway URL (port 8080)
        return `https://${codespaceName}-8081.app.github.dev`;
      }
    }
    
    // Local development - use API Gateway
    return 'http://localhost:8081';
  };

  const API_BASE_URL = getApiUrl();

  useEffect(() => {
    console.log('Fetching from:', `${API_BASE_URL}/products`);
    
    fetch(`${API_BASE_URL}/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Products loaded:', data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading products...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>Error loading products:</h3>
        <p>{error}</p>
        <p>{window.location.hostname}</p>
        <p>API URL: {API_BASE_URL}/products</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products Table</h2>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Loaded from: {API_BASE_URL}
      </p>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Inventory</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.inventory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;