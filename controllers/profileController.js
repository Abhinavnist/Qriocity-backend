const User = require("../models/User")
const bcrypt = require("bcryptjs")

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Fetch user information
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Fetch initiatives joined by the user
    // const initiativesJoined = await Initiative.find({ participants: userId })

    // res.json({ user, initiativesJoined })
    res.json({ user })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const updateProfile = async (req, res) => {
  const { name, email, password, interests } = req.body

  try {
    let user = await User.findById(req.user.id)

    // Update name
    if (name) user.name = name

    // Update email
    if (email) user.email = email

    // Update password
    if (password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
    }

    // Update interests
    if (interests) user.interests = interests

    await user.save()
    res.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id)
    res.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
}
