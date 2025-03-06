const { heshPass, Token, comparePass } = require("../helper/helpers");
const BlackListedTokenModel = require("../models/BlackListedTokens.model");
const userModel = require("../models/user.model");

module.exports.SingupUserController = async (req, res) => {
  try {
    const { userName, email, password, confirm_pass } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    console.log(profileImage);

    if (!userName || !email || !password || !confirm_pass) {
      res.status(400).send({
        success: false,
        msg: "All Fields Required",
      });
    }

    // check user already exists or not
    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(401).send({
        success: false,
        msg: "User Already Exists",
      });
    }

    // hash password and confirm password
    const hashedPassword = await heshPass(password);
    const hashedConfirmPass = await heshPass(confirm_pass);

    const newUser = await userModel.create({
      userName,
      email,
      profileImage,
      password: hashedPassword,
      confirm_pass: hashedConfirmPass,
    });

    const token = await Token(newUser); // Generate token after user creation

    res.status(201).send({
      success: true,
      msg: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.log("Error during user registration:", error);
    res.status(500).send({
      success: false,
      msg: "Server Error",
    });
  }
};

module.exports.LoginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({
        success: false,
        msg: "All Fields Required",
      });
    }

    // check user is register or not
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).send({
        success: false,
        msg: "Invalid Email & Password",
      });
    }

    // check password

    const matchPassword = await comparePass(password, user.password);

    if (!matchPassword) {
      return res.status(401).send({
        success: false,
        msg: "Invalid Email & Password",
      });
    }

    // token
    const token = await Token(user);

    res.status(201).send({
      success: true,
      msg: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      msg: "Login Failed Try Again",
    });
  }
};

module.exports.UserProfileController = async (req, res) => {
  const user = await userModel.find({});

  res.status(200).send({
    success: true,
    user,
  });
};

module.exports.UserSearchController = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {};

    if (search) {
      query.$or = [{ userName: new RegExp(search, "i") }];
    }

    const searchedUser = await userModel.find(query);

    return res.status(200).send({
      success: true,
      searchedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      msg: "User Not Found",
    });
  }
};

module.exports.LogoutUserController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    await BlackListedTokenModel.create({ token });

    res.status(200).send({
      success: true,
      msg: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      msg: "Logout failed",
    });
  }
};
