const express = require("express")
const mongoose = require("mongoose")
const config = require("./config/config")
const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
const initiativeRoutes = require("./routes/initiativeRoutes")
const postRoutes = require("./routes/postRoutes")
const path = require("path")
const app = express()
const cors = require("cors")

// Middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/initiatives", initiativeRoutes)
app.use("/api/posts", postRoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
