import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  const newCart = await manager.createCart();
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const id = parseInt(req.params.cid);
  const cart = await manager.getCartById(id);
  cart ? res.json(cart) : res.status(404).json({ error: "Not found" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const updated = await manager.addProductToCart(cartId, productId);
  updated ? res.json(updated) : res.status(404).json({ error: "Not found" });
});

export default router;
