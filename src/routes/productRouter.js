import { Router } from "express";
import ProductDao from "../daos/productDao.js";
import ProductDto from "../dtos/productDtos.js";

const router = Router();
const productDao = new ProductDao();

router.get("/", async (req, res) => {
  try {
    const products = await productDao.getAll();
    const payload = products.map(p => new ProductDto(p));
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
