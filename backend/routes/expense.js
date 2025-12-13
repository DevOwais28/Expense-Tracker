import express  from "express"
import { createExpense, getExpense ,deleteExpense,editExpense} from "../controllers/expense.js"
const router = express.Router()


router.get("/expense",getExpense)
router.post("/expense",createExpense)
router.delete("/expense/:id",deleteExpense)
router.put("/expense/:id",editExpense)
export default router