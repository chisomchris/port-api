const { Router } = require("express");
const { forgotPassword } = require("../controllers/authController");
const router = Router();

router.route("/").post(forgotPassword);

module.exports = router;
