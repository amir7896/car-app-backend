const User = require("../models/auth");
const authService = require("../services/authService");
const { ERRORS, STATUS_CODE, SUCCESS_MSG } = require("../constants");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !(await authService.comparePasswords(password, user.password))
    ) {
      return res
        .status(STATUS_CODE.UN_AUTHORIZED)
        .json({ success: false, message: ERRORS.ERRORS.INVALID_CREDENTIALS });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      username: user.userName,
    };

    const expiresIn = "10h";
    const token = await authService.generateJwtToken(payload, expiresIn);

    // Send the token as part of the response
    res.status(STATUS_CODE.OK).json({
      success: true,
      message: SUCCESS_MSG.AUTH_MSG.LOGIN_SUCCESS,
      user: payload,
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ success: false, message: ERRORS.ERRORS.SERVER_ERROR });
  }
};

module.exports = {
  loginUser,
};
