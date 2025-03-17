import express from "express"
import { getUser, getUserConnections, addRemoveConnection , editUser} from "../controllers/user.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/:id", verifyToken, getUser)
router.get("/connections/:id", verifyToken, getUserConnections)
router.patch("/:id/:connectionId", verifyToken, addRemoveConnection)
router.put("/edit", verifyToken, editUser)

export default router