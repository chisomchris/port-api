const allowedOrigins = [
  "http://127.0.0.1:3001",
  "http://localhost:3001",
  "http://192.168.43.127:3001",
];

const ROLES_LIST = {
  Admin: 5151,
  Editor: 2121,
  User: 1111,
};
const OTP_ACTIONS = {
  NewUser: 9090,
  PasswordChange: 2121,
};

module.exports = { allowedOrigins, ROLES_LIST, OTP_ACTIONS };
