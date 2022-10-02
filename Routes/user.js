const router = require("express").Router();
const {loginUser, signUpUser} = require("../controllers/user")

router.post("/sign-up", signUpUser);
router.post("/login", loginUser);

module.exports = router;