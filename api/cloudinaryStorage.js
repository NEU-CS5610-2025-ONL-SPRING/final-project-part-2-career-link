const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw",
    access_mode: 'public',
    format: async (req, file) => file.originalname.split(".").pop(),
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
