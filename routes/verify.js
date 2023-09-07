const { Router } = require("express");
const { verifyNewUser } = require("../controllers/registerController");
const router = Router();

router.route("/").post(verifyNewUser);

module.exports = router;
