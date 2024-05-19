const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const profileController = require("../controllers/profileController")

router.use(authMiddleware)

router.get("/profile", profileController.getProfile)
router.put("/profile", profileController.updateProfile)
router.delete("/profile", profileController.deleteAccount)

module.exports = router
