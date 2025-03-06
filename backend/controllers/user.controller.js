const { heshPass, Token, comparePass } = require("../helper/helpers");
const BlackListedTokenModel = require("../models/BlackListedTokens.model");
const userModel = require("../models/user.model");

const SignupUserController = async (req, res) => {
  try {
    const { userName, email, password, confirm_pass } = req.body;

    const profileImage = req.file ? req.file.filename : null;

    console.log(userName, email, password, confirm_pass);
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
      return res.status(401).send({ msg: "User Already Exists" });
    }

    // check password and confirm_pass
    if (password !== confirm_pass) {
      return res.status(401).send({ msg: "Password & Confirm_pass Not Match" });
    }

    // hash password and confirm password
    const hashedPassword = await heshPass(password);

    const newUser = await userModel.create({
      userName,
      email,
      profileImage,
      password: hashedPassword,
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

const LoginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePass(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Generate token
    const token = await Token(user);

    // Send success response
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
        // Add other necessary user fields (avoid sensitive data like password)
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      msg: "Login failed. Please try again later.",
    });
  }
};

const GetAllUserController = async (req, res) => {
  const loggedInUser = req.user?._id;

  const user = await userModel
    .find({ _id: { $ne: loggedInUser } })
    .select("-password");

  res.status(200).send({
    success: true,
    user,
  });
};

const UserSearchController = async (req, res) => {
  try {
    const { search } = req.query;

    console.log(search)

    const query = {};

    if (search) {
      query.$or = [{ userName: new RegExp(search, "i") }];
    }

    const users = await userModel.find(query);

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      msg: "User Not Found",
    });
  }
};

const LogoutUserController = async (req, res) => {
  try {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Authorization token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    // Check if the token is already blacklisted
    const isTokenBlacklisted = await BlackListedTokenModel.findOne({ token });
    if (isTokenBlacklisted) {
      return res.status(200).json({
        success: true,
        msg: "User already logged out",
      });
    }

    // Add token to the blacklist
    await BlackListedTokenModel.create({ token });

    // Send success response
    return res.status(200).json({
      success: true,
      msg: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      msg: "Logout failed. Please try again later.",
    });
  }
};

// protect user
const ProtectUserController = async (req, res) => {
  try {
    await res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  SignupUserController,
  LoginUserController,
  GetAllUserController,
  UserSearchController,
  LogoutUserController,
  ProtectUserController,
};
