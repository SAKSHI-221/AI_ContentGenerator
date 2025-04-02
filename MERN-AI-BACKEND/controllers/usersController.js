const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

//!-----Registration----
const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //Validate:
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please all fields are required" });
    }
    //Check the email is taken:
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: false, message: "User already exist" });
    }
    //Hash the user password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create the user:
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });
    //Add the date the trial will end;
    if (newUser.trialPeriod) {
      newUser.trialExpires = new Date(
        new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
      );
    }

    //Save the user:
    await newUser.save();
    res.json({
      status: true,
      message: "Registration was success full",
      user: {
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});
//!----Login----
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check for user email:
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  //Check if password is valid:
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //Generate token (jwt):
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  }); //token expires in 3 days
  console.log(token);
  //set the token into cookie (http only)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, //1day
  });
  //send the response:
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login success",
    username: user?.username,
    email: user?.email,
  });
});

//!----Logout----
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});
//!----Profile----
const userProfile = asyncHandler(async (req, res) => {
  const id = "67ed0b610237646136442b12";
  const user = await User.findById(id).select("-password");
  console.log(user);
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
//!----Check user Auth Status----

module.exports = {
  register,
  login,
  logout,
  userProfile,
};
