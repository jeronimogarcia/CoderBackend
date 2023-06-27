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

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
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

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
