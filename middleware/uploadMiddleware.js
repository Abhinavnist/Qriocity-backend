const multer = require("multer")

// Set storage engine
const storage = multer.memoryStorage()

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  },
}).single("image") // 'image' is the name of the field in the form data

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(file.originalname.toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb("Error: Images Only!")
  }
}

module.exports = upload
