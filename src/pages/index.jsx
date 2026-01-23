import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

<Link href="/saved-products">
  <a style={{ display: "inline-block", marginBottom: "1rem", color: "#0070f3" }}>
    View Saved Products
  </a>
</Link>


export default function Home() {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const [expirationDates, setExpirationDates] = useState({});



  const fetchProduct = async () => {
    if (!barcode && !name) return alert("Enter barcode or product name");

    const query = barcode ? `barcode=${barcode}` : `name=${name}`;
    try {
      const res = await fetch(`/api/product?${query}`);
      const data = await res.json();

      if (data.success) {
        const result = Array.isArray(data.product)
          ? data.product
          : [data.product];
        setProducts(result);
        router.replace(`/?${query}`, undefined, { shallow: true });
      } else {
        alert("Product not found");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching product");
    }
  };

  const nutriScoreColor = (grade) => {
    switch (grade) {
      case "a":
        return "#4CAF50";
      case "b":
        return "#8BC34A";
      case "c":
        return "#FFEB3B";
      case "d":
        return "#FF9800";
      case "e":
        return "#F44336";
      default:
        return "#ccc";
    }
  };

  const saveProduct = (product) => {
    const expirationDate = expirationDates[product.code];
  
    if (!expirationDate) {
      alert("Please enter an expiration date");
      return;
    }
  
    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
  
    const exists = saved.some((p) => p.code === product.code);
    if (exists) {
      alert("Product already saved");
      return;
    }
  
    const productToSave = {
      ...product,
      expirationDate,
      savedAt: new Date().toISOString(),
    };
  
    saved.push(productToSave);
    localStorage.setItem("savedProducts", JSON.stringify(saved));
  
    // clear date input for this product
    setExpirationDates((prev) => {
      const copy = { ...prev };
      delete copy[product.code];
      return copy;
    });
  
    alert("Product saved!");
  };
  
  

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Open Food Facts</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Or enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={fetchProduct}>Search</button>
      </div>

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
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {product.image_small_url && (
              <img
                src={product.image_small_url}
                alt={product.product_name}
                style={{ width: "100%", borderRadius: "4px", marginBottom: "0.5rem" }}
              />
            )}

            <h3>{product.product_name || "No name"}</h3>
            <p>Brand: {product.brands || "Unknown"}</p>
            <p>Barcode: {product.code}</p>

            {product.nutriscore_grade && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "4px",
                  backgroundColor: nutriScoreColor(product.nutriscore_grade),
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                Nutri-Score: {product.nutriscore_grade.toUpperCase()}
              </span>
            )}

            {product.nutriments && (
              <div>
                <h4>Nutrition Facts (per 100g)</h4>
                <ul style={{ paddingLeft: "1.2rem" }}>
                  {product.nutriments.energy_kcal && (
                    <li>Energy: {product.nutriments.energy_kcal} kcal</li>
                  )}
                  {product.nutriments.fat && <li>Fat: {product.nutriments.fat} g</li>}
                  {product.nutriments.saturated_fat && (
                    <li>Saturated Fat: {product.nutriments.saturated_fat} g</li>
                  )}
                  {product.nutriments.carbohydrates && (
                    <li>Carbohydrates: {product.nutriments.carbohydrates} g</li>
                  )}
                  {product.nutriments.sugars && <li>Sugars: {product.nutriments.sugars} g</li>}
                  {product.nutriments.fiber && <li>Fiber: {product.nutriments.fiber} g</li>}
                  {product.nutriments.proteins && <li>Proteins: {product.nutriments.proteins} g</li>}
                  {product.nutriments.salt && <li>Salt: {product.nutriments.salt} g</li>}
                </ul>
              </div>
            )}

            <div>
            <label style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
  Expiration Date:
</label>

            <input
              type="date"
              value={expirationDates[product.code] || ""}
              onChange={(e) =>
                setExpirationDates({
                  ...expirationDates,
                  [product.code]: e.target.value,
                })
              }
              style={{
                padding: "0.4rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "0.5rem",
              }}
            />



              <button
                onClick={() => saveProduct(product)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}