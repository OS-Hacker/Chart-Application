const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// hesh password
module.exports.heshPass = async (password) => {
  if (!password) {
    throw new Error("Password is required.");
  }
  try {
    const salt = 10;
    const heshPassword = await bcrypt.hash(password, salt);
    return heshPassword;
  } catch (error) {
    console.log("Error hashing password: ", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};


// compare password
module.exports.comparePass = async (password, ExistUserPass) => {
  try {
    const comparePassword = await bcrypt.compare(password, ExistUserPass);
    return comparePassword;
  } catch (error) {
    console.log(error);
  }
};

module.exports.Token = async (user) => {
  try {
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated Token: ", token); // Log the generated token
    return token;
  } catch (error) {
    console.log("Error generating token: ", error); // Log detailed error
  }
};

// multer image uplode

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

module.exports.upload = multer({ storage: storage });
