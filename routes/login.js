const { Router } = require("express");
const { handleLogin } = require("../controllers/authController");
const router = Router();

router.route("/").post(handleLogin);

module.exports = router;
