import { useEffect, useState } from "react";

export default function SavedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
    setProducts(saved);
  }, []);

  const removeProduct = (code) => {
    const updated = products.filter((p) => p.code !== code);
    setProducts(updated);
    localStorage.setItem("savedProducts", JSON.stringify(updated));
  };

  if (products.length === 0) {
    return <h2 style={{ padding: "2rem" }}>No saved products yet.</h2>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Saved Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.code}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {product.image_small_url && (
              <img
                src={product.image_small_url}
                alt={product.product_name}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            )}

            <h3>{product.product_name || "No name"}</h3>
            <p>Brand: {product.brands || "Unknown"}</p>
            <p>Barcode: {product.code}</p>

            {product.expirationDate && (
          <p>
            <strong>Expires:</strong>{" "}
            {new Date(product.expirationDate).toLocaleDateString()}
          </p>
        )}


            <button
              onClick={() => removeProduct(product.code)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
