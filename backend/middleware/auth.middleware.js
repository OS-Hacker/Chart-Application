const JWT = require("jsonwebtoken"); // Make sure you require jsonwebtoken
// const BlackListedTokenModel = require("../models/BlackListedTokens.model");

const authUser = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).send({ msg: "Unauthorized - No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1]; // ["bearer", "token"]

    // Check if token is provided
    if (!token) {
      return res
        .status(401)
        .send({ msg: "Unauthorized - Invalid token format" });
    }

    // check it is blackListed token or not
    // const isBlackListedToken = await BlackListedTokenModel.findOne({ token });

    // if (isBlackListedToken) {
    //   return res.status(401).send({ msg: "Unauthorized - BlackListed Token" });
    // }

    // Verify token
    const decode = await JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    // if all ok then go to next route
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      msg: "Unauthorized - Token verification failed",
    });
  }
};

module.exports = authUser;
