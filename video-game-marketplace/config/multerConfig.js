// multerConfig.js
const multer = require('multer');
const path = require('path');

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/gameImages/')); // Directory to save the uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to ensure unique filenames
    }
});

// Set up the upload middleware using multer
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
