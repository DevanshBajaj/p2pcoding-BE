const Sequelize = require("sequelize")
const {Solution, Problem, Activity} = require("../sequelize");
const {verifyJWT} = require("../utils/jwt");
const {runCodeInternal} = require("./code.js")
const {badRequestError, unauthorizedError, internalServerError} = require("../Helpers/errorHelper")

const solutionController = {
    listSolutions: async (req, res) => {
        try {
            const solutions = await Solution.findAll()

            return res.status(200).json({status: "success", data: solutions})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    getSolutionById: async (req, res) => {
        try {
            if (!req.params.id) return badRequestError(res, "missingField", "Solution id is required");

            const solution = await Solution.findOne({
                where: {
                    id: req.params.id
                }
            })

            if (solution == null) {
                return res.status(404).json({errorCode: 404, errorDescription: "No record found for " + req.params.id})
            }

            return res.status(200).json({status: "success", data: solution})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    addSolution: async (req, res) => {
        try {
            const body = req.body;
            if (!body.language) return badRequestError(res, "missingField", "Solution language is required");
            if (!body.code) return badRequestError(res, "missingField", "Solution code is required");
            if (!body.isWorking) return badRequestError(res, "missingField", "Solution isWorking is required");


            const solution = await Solution.create({
                language: body.language,
                code: body.code,
                isWorking: body.isWorking
            })

            return res.status(200).json({status: "success", data: solution})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    runSolution: async (req, res) => {
        try {
            const body = req.body;
            if (!body.language) return badRequestError(res, "missingField", "Solution language is required");
            if (!body.code) return badRequestError(res, "missingField", "Solution code is required");
            if (!body.problemId) return badRequestError(res, "missingField", "Solution problemId is required");

            const tokenData = verifyJWT(req);

            if (tokenData.status !== 200) {
                return res.status(tokenData.status).json({
                    errorCode: tokenData.status,
                    errorDescription: "Incorrect JWT token"
                })
            }

            console.log(tokenData);
            const user = tokenData.user;

            const problem = await Problem.findOne({
                where: {
                    id: body.problemId
                },
                raw: true
            })

            if (problem == null) {
                return res.status(404).json({errorCode: 404, errorDescription: "No record found for " + body.problemId})
            }

            const input = (body.input) ? body.input : problem.testCase;

            const status = await runCodeInternal(body.code, input, user.id, body.language);
            const realSolution = problem.testCaseOutput && problem.testCaseOutput.trimStart().trimEnd()
            const userSolution = status.stdout && status.stdout.trimStart().trimEnd()

            const solution = await Solution.create({
                language: body.language,
                code: body.code,
                isWorking: (status.stderr == null && userSolution === realSolution)
            })

            const activity = await Activity.create({
                problemId: body.problemId,
                solutionId: solution.id,
                userId: user.id,
            })

            const result = {
                id: solution.id,
                language: solution.language,
                isWorking: solution.isWorking,
                code: solution.code,
                stdout: status.stdout,
                stderr: status.stderr
            }

            return res.status(200).json({status: "success", data: result})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    }
}

module.exports = solutionController