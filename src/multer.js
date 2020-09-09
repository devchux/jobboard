const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
      const filetypes = /jpg|jpeg|png|gif/;
      // Check extension name    
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mimetype
      const mimetype = filetypes.test(file.mimetype);

      if (extname && mimetype) {
      return cb(null, true);
      } else {
        cb('Error: Images only!');
      }
  }
});
