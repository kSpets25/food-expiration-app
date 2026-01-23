import { useEffect, useState } from "react";
import Link from "next/link";

export default function ExpiringProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];

    const now = new Date();
    const in14Days = new Date();
    in14Days.setDate(now.getDate() + 14);

    const expiringSoon = saved
        .filter((product) => {
            if (!product.expirationDate) return false;
            const expDate = new Date(product.expirationDate);
            return expDate >= now && expDate <= in14Days;
        })
        .sort(
            (a, b) =>
            new Date(a.expirationDate) - new Date(b.expirationDate)
        );

        setProducts(expiringSoon);


    
  }, []);

  const daysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Expiring in the Next 14 Days</h1>

      <Link href="/saved-products">
        ← Back to Saved Products
      </Link>

      {products.length === 0 && (
        <p style={{ marginTop: "1rem" }}>
          🎉 No products expiring in the next 14 days.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {products.map((product) => {
          const remaining = daysLeft(product.expirationDate);

          return (
            <div
              key={product.code}
              style={{
                border:
                  remaining <= 3
                    ? "2px solid #e53935"
                    : "2px solid #ff9800",
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

              <p>
                <strong>Expires:</strong>{" "}
                {new Date(product.expirationDate).toLocaleDateString()}
              </p>

              <p
                style={{
                  fontWeight: "bold",
                  color: remaining <= 3 ? "#e53935" : "#ff9800",
                }}
              >
                ⏰ {remaining} day{remaining !== 1 ? "s" : ""} left
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
