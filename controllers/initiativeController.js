const Initiative = require("../models/Initiative")

const getInitiatives = async (req, res) => {
  try {
    const initiatives = await Initiative.find().populate(
      "creator participants",
      "name createdAt image"
    )
    const initiativesWithDetails = initiatives.map((initiative) => {
      return {
        _id: initiative._id,
        title: initiative.title,
        description: initiative.description,
        creator: initiative.creator.name,
        createdAt: formatDate(initiative.createdAt),
        numberOfMembers: initiative.participants.length,
        members: initiative.participants.map((member) => member.name),
        image: initiative.image,
      }
    })
    res.json(initiativesWithDetails)
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

const createInitiative = async (req, res) => {
  try {
    const { title, description } = req.body
    const image = req.file ? req.file.buffer : null
    const newInitiative = new Initiative({
      title,
      description,
      image,
      creator: req.user.id,
    })
    const initiative = await newInitiative.save()
    res.status(201).json(initiative)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const joinInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id)
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" })
    }

    // Check if user is already a participant
    if (initiative.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "User already joined the initiative" })
    }

    // Add user to participants
    initiative.participants.push(req.user.id)
    await initiative.save()

    res.json({ message: "User joined initiative successfully", initiative })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const updateInitiative = async (req, res) => {
  try {
    const { title, description } = req.body
    const initiative = await Initiative.findById(req.params.id)
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" })
    }

    // Check if user is the creator of the initiative
    if (initiative.creator.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this initiative" })
    }

    // Update initiative
    initiative.title = title
    initiative.description = description
    await initiative.save()

    res.json({ message: "Initiative updated successfully", initiative })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

const deleteInitiative = async (req, res) => {
  try {
    const initiative = await Initiative.findById(req.params.id)
    if (!initiative) {
      return res.status(404).json({ message: "Initiative not found" })
    }

    // Check if user is the creator of the initiative
    if (initiative.creator.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this initiative" })
    }

    // Delete initiative
    await initiative.remove()

    res.json({ message: "Initiative deleted successfully" })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server Error" })
  }
}

module.exports = {
  getInitiatives,
  createInitiative,
  joinInitiative,
  updateInitiative,
  deleteInitiative,
}
