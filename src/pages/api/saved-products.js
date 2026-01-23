import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const { barcode, name } = req.query;

  // 1. Connect to MongoDB
  const client = await clientPromise;
  const db = client.db("openfoodapp");
  const collection = db.collection("products");

  let product;

  try {
    if (barcode) {
      // Fetch from Open Food Facts by barcode
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}.json`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic " + Buffer.from("off:off").toString("base64"),
          },
        }
      );
      const data = await response.json();
      product = data.product;

      // Save to MongoDB
      if (product) {
        await collection.updateOne(
          { code: barcode },
          { $set: product },
          { upsert: true }
        );
      }
    } else if (name) {
      // Search products by name
      const response = await fetch(
        `https://world.openfoodfacts.net/cgi/search.pl?search_terms=${encodeURIComponent(
          name
        )}&search_simple=1&action=process&json=1`
      );
      const data = await response.json();
      product = data.products;
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}