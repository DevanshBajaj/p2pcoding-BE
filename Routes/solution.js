const router = require("express").Router();
const {listSolutions, getSolutionById, addSolution, runSolution} = require("../controllers/solution")

router.get("/", listSolutions);
router.post("/", addSolution);
router.get("/:id", getSolutionById);
router.post("/run", runSolution);

module.exports = router;