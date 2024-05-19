const Post = require("../models/Post")

// Get Post by ID
const getPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email")

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" })
    }

    const formattedPosts = posts.map((post) => ({
      ...post._doc,
      date: formatDate(post.createdAt),
    }))

    res.json(formattedPosts)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }
  return new Date(date).toLocaleDateString(undefined, options)
}

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body
    const image = req.file ? req.file.path : null

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      image,
    })

    const post = await newPost.save()
    res.status(201).json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

// Update Post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this post" })
    }

    // Update post
    post.title = title
    post.content = content

    if (req.file) {
      post.image = req.file.path
    }

    await post.save()
    res.json({ message: "Post updated successfully", post })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

// Delete Post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this post" })
    }

    // Delete post
    await post.remove()
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

module.exports = {
  getPost,
  createPost,
  updatePost,
  deletePost,
}
