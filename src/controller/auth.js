import UserAuth from "../models/UserAuth.js";
import { asyncHandler } from "../middlewares/async.js";
import ErrorResponse from "../utils/errorResponse.js";

export const register = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  // Create User
  const user = await UserAuth.create({
    first_name,
    last_name,
    email,
    password,
    role,
  });
  
  sentTokenResponse(user, 200, res)
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Quick validation
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Check for user
  const user = await UserAuth.findOne({email}).select('+password')

  if(!user){
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if(!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sentTokenResponse(user, 200, res)
});

// Get token from model, create cookie and send response
const sentTokenResponse = (user, statusCode, res) => {

  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}