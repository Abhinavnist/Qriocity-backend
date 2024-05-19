// const multer = require("multer")

// // Set storage engine
// const storage = multer.memoryStorage()

// // Initialize upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }, // Limit file size to 1MB
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb)
//   },
// }).single("image") // 'image' is the name of the field in the form data

// // Check file type
// function checkFileType(file, cb) {
//   // Allowed extensions
//   const filetypes = /jpeg|jpg|png|gif/
//   const extname = filetypes.test(file.originalname.toLowerCase())
//   const mimetype = filetypes.test(file.mimetype)

//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb("Error: Images Only!")
//   }
// }

// module.exports = upload

const multer = require("multer")
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dctct5odm",
  api_key: "563635261134469",
  api_secret: "Xgajo3gPcp9i1X27UEyxUM0auxM",
})

// Set Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "enviornment", // Optional - folder name in Cloudinary
    format: async (req, file) => "jpg", // Example - convert all files to jpg format
    public_id: (req, file) => "image-" + Date.now(), // Example - generate unique public ID
  },
})

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
