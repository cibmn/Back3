import ProductModel from "../models/productModel.js";

export const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    return res.json({ ok: true, payload: products });
  } catch (err) {
    console.error("listProducts error:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error listing products" });
  }
};
