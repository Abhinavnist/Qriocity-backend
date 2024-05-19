const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const uploadMiddleware = require("../middleware/uploadMiddleware")
const postController = require("../controllers/postController")

router.get("/posts", postController.getPost)

router.post(
  "/posts",
  authMiddleware,
  uploadMiddleware,
  postController.createPost
)
router.put(
  "/posts/:id",
  authMiddleware,
  uploadMiddleware,
  postController.updatePost
)
router.delete("/posts/:id", authMiddleware, postController.deletePost)

module.exports = router
