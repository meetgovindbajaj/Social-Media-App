const emailValidator = require("deep-email-validator");
const asyncHandler = require("express-async-handler");

const Email_Checker = asyncHandler(async (email) => {
  const checker = await emailValidator.validate(email);
  if (checker.valid) {
    return { valid: true, message: "Email available" };
  } else {
    const errorMessage = !checker.validators.regex.valid
      ? checker.validators.regex.reason
      : !checker.validators.typo.valid
      ? checker.validators.typo.reason
      : !checker.validators.disposable.valid
      ? checker.validators.disposable.reason
      : !checker.validators.mx.valid
      ? checker.validators.mx.reason
      : !checker.validators.smtp.valid
      ? checker.validators.smtp.reason
      : "Invalid email";
    return { valid: false, message: errorMessage };
  }
});
module.exports = Email_Checker;
