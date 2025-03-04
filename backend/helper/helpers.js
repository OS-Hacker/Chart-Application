const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// hesh password
module.exports.heshPass = async (password) => {
  try {
    const salt = 10;
    const heshPassword = await bcrypt.hash(password, salt);
    return heshPassword;
  } catch (error) {
    console.log(error);
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
