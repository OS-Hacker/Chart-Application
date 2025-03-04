const { heshPass, Token, comparePass } = require("../helper/helpers");
const userModel = require("../models/user.model");

module.exports.SingupUserController = async (req, res) => {
  try {
    const { userName, email, password, confirm_pass } = req.body;

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

    // create token
    const token = await Token(user);

    const newUser = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      confirm_pass: hashedConfirmPass,
    });

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

    const newUser = await userModel.create({
      email,
      password,
    });

    res.status(201).send({
      success: true,
      msg: "Login Successfully",
      token,
      user: newUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      msg: "Login Failed Try Again",
    });
  }
};


