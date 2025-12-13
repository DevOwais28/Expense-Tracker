import express  from "express"
import { callFastAPI } from "../controllers/prediction.js";
const router = express.Router()

router.post("/predict-expense", async (req, res) => {
  try {
    const prediction = await callFastAPI(req.body);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router