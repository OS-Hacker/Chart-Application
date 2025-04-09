const { heshPass, Token, comparePass } = require("../helper/helpers");
const cloudinary = require("../lib/cloudinary");
const BlackListedTokenModel = require("../models/BlackListedTokens.model");
const messageModel = require("../models/Message.model");
const userModel = require("../models/user.model");

// SINGUP USER
const SignupUserController = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    console.log(req.file.path);

    // Validations
    if (!userName || !email || !password) {
      return res
        .status(400)
        .send({ success: false, msg: "All fields are required!" });
    }

    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        msg: "Password must be at least 8 characters long!",
      });
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ success: false, msg: "Please enter a valid email address!" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .send({ success: false, msg: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await heshPass(password);

    // add profile image in cloudnary
    let imageUrl;
    if (req.file) {
      try {
        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).send({ msg: "Failed to upload image" });
      }
    }

    // Create new user
    const newUser = await userModel.create({
      userName,
      email,
      profileImage: imageUrl,
      password: hashedPassword,
      cloudinary_id: uploadResponse.public_id,
    });

    // Generate token
    const token = await Token(newUser);

    // Send success response
    return res.status(201).send({
      success: true,
      msg: "User created successfully!",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).send({
      success: false,
      msg: "Server error during registration. Please try again later.",
    });
  }
};

// LOGIN USER
const LoginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });

    // Compare passwords
    const isPasswordValid = await comparePass(password, user.password);

    if (!isPasswordValid || !user) {
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
        _id: user._id,
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

// GET USER
const GetAllUserController = async (req, res) => {
  try {
    const loggedInUser = req.user?._id;

    // Fetch all users except the logged-in user
    const users = await userModel
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");

    // Fetch the last message for each user
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await messageModel
          .findOne({
            $or: [
              { senderId: loggedInUser, receiverId: user._id },
              { senderId: user._id, receiverId: loggedInUser },
            ],
          })
          .sort({ createdAt: -1 }) // Sort by most recent message
          .limit(1);

        return {
          ...user.toObject(),
          lastMessage: lastMessage ? lastMessage : null,
        };
      })
    );

    // Sort users by the timestamp of the last message
    usersWithLastMessage.sort((a, b) => {
      const timeA = a.lastMessage ? a.lastMessage.createdAt : 0;
      const timeB = b.lastMessage ? b.lastMessage.createdAt : 0;
      return timeB - timeA; // Sort in descending order (most recent first)
    });

    res.status(200).send({
      success: true,
      users: usersWithLastMessage,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// USER SEARCH
const UserSearchController = async (req, res) => {
  try {
    const { search } = req.query;
    const loggedInUser = req.user?._id; // Get the logged-in user's ID

    const query = { _id: { $ne: loggedInUser } }; // Exclude the logged-in user

    if (search) {
      query.$or = [{ userName: new RegExp(search, "i") }];
    }

    const users = await userModel.find(query).select("-password"); // Exclude password field

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      msg: "Error searching for users",
      error: error.message,
    });
  }
};

// Update USER PROFILE
const EditUserProfileController = async (req, res) => {
  try {
    const existingUser = await userModel.findById(req.params.id);

    console.log(existingUser);

    if (!existingUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // If there's an existing cloudinary image, delete it first
    if (existingUser.cloudinary_id) {
      await cloudinary.uploader.destroy(existingUser.cloudinary_id);
    }

    // Upload new image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const updateData = {
      cloudinary_id: result.public_id,
      profileImage: result.secure_url, // using secure_url is recommended
    };

    const updatedUser = await userModel
      .findByIdAndUpdate(req.params.id, updateData, { new: true })
      .select("-password");

    res.status(200).json({
      success: true,
      msg: "Profile image updated",
      profileImage: updatedUser.profileImage,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Error updating profile image",
      error: error.message,
    });
  }
};

const EditUserNameController = async (req, res) => {
  try {
    const { userName } = req.body;
    const userId = req.user._id;

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update username",
    });
  }
};

// USER LOGOUT
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

// PROTECT USER
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
  EditUserProfileController,
  EditUserNameController,
};
