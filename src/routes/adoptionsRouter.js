import { Router } from "express";
import mongoose from "mongoose";
import UserDao from "../daos/userDao.js";
import UserDto from "../dtos/userDtos.js";
import { isAuth, authRole } from "../middlewares/auth.js";

const router = Router();
const userDao = new UserDao();

router.get("/", isAuth, authRole(["admin"]), async (req, res) => {
  try {
    const users = await userDao.getAll();
    const payload = users.map((u) => new UserDto(u));
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/:id", isAuth, authRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ ok: false, error: "Invalid user ID" });
  }
  try {
    const user = await userDao.getById(id);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });
    const payload = new UserDto(user);
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.patch("/:id", isAuth, authRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ ok: false, error: "Invalid user ID" });
  }
  try {
    const user = await userDao.update(id, req.body);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });
    const payload = new UserDto(user);
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/:id", isAuth, authRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ ok: false, error: "Invalid user ID" });
  }
  try {
    const user = await userDao.delete(id);
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });
    const payload = new UserDto(user);
    res.json({ ok: true, payload });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
