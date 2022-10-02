const router = require("express").Router();
const { runCode } = require("../controllers/code.js")

router.post("/run", runCode);

module.exports = router;