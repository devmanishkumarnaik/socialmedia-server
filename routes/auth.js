import express from "express"
import { login , register, verifyToken,oauthLogin } from "../controllers/auth.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.get("/verify", verifyToken)
router.post("/oauth-login",oauthLogin)

export default router