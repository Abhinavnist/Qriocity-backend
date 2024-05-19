const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../config/config")

exports.register = async (req, res) => {
  try {
    const { email, password, name, interests } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    user = new User({ email, password: hashedPassword, name, interests })
    await user.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and send JWT token
    const payload = { user: { id: user.id } }
    jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.logout = async (req, res) => {
  // You can clear the authentication token from client-side storage here
  res.json({ message: "Logged out successfully" })
}

exports.verifyToken = async (req, res) => {
  const token = req.header("token")
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    res.json({ isValid: true, user: decoded.user })
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}
