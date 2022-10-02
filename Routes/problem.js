const router = require("express").Router();
const {listProblems, getProblemByTitle, addProblem} = require("../controllers/problem")

router.get("/", listProblems);
router.post("/", addProblem);
router.get("/:title", getProblemByTitle);

module.exports = router;