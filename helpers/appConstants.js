module.exports = Object.freeze({
  SUPERUSER_LEVEL: 90, // Level of 90 or higher is required for admin access
  HEAD_JUDEGE_LEVEL: 1,
  USER_LEVEL: 0,
  APP_NAME: "CIA Scoresheet",
  PASSWORD_REGEX: /.*/, // Regex for checking if password is strong enough
  EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
});
