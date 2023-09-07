const { Router } = require("express");
const { handleRegister } = require("../controllers/registerController");
const router = Router();

router.route("/").post(handleRegister);

module.exports = router;
