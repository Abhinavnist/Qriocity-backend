const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const initiativeController = require("../controllers/initiativeController")
const uploadMiddleware = require("../middleware/uploadMiddleware")

router.get("/initiatives", initiativeController.getInitiatives)
router.use(authMiddleware)
router.post(
  "/initiatives",
  uploadMiddleware,
  initiativeController.createInitiative
)
router.put("/initiatives/:id/join", initiativeController.joinInitiative)
router.put("/initiatives/:id", initiativeController.updateInitiative)
router.delete("/initiatives/:id", initiativeController.deleteInitiative)

module.exports = router
