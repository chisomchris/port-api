const { Router } = require("express");
const { resetPassword } = require("../controllers/authController");
const router = Router();

router.route("/").post(resetPassword);

module.exports = router;
