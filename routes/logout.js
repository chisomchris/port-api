const { Router } = require("express");
const handleLogout = require("../controllers/logoutController");
const router = Router();

router.route("/").get(handleLogout);
module.exports = router;
