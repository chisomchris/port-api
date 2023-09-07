const { Router } = require("express");
const { handleLogout } = require("../controllers/authController");
const router = Router();

router.route("/").get(handleLogout);
module.exports = router;
