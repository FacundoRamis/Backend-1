import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

// GET /
router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

// GET /:pid
router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);
  product ? res.json(product) : res.status(404).json({ error: "Not found" });
});

// POST /
router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:pid
router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const updated = await manager.updateProduct(id, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: "Not found" });
});

// DELETE /:pid
router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  await manager.deleteProduct(id);
  res.json({ message: "Deleted" });
});

export default router;
