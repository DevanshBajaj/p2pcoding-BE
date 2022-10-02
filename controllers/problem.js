const Sequelize = require("sequelize")
const {Problem, Solution} = require("../sequelize");
const {badRequestError, unauthorizedError, internalServerError} = require("../Helpers/errorHelper")

const problemController = {
    listProblems: async (req, res) => {
        try {
            const problems = await Problem.findAll({
                raw: true,
            })

            for (const problem of problems) {
                problem.solution = await Solution.findOne({
                    where: {
                        id: problem.solutionId
                    }
                })

                delete problem.solutionId
            }

            return res.status(200).json({status: "success", data: problems})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    getProblemById: async (req, res) => {
        try {
            if (!req.params.id) return badRequestError(res, "missingField", "Problem id is required");

            const problem = await Problem.findOne({
                where: {
                    id: req.params.id
                },
                raw: true
            })

            if (problem == null) {
                return res.status(404).json({errorCode: 404, errorDescription: "No record found for " + req.params.id})
            }

            problem.solution = await Solution.findOne({
                where: {
                    id: problem.solutionId
                }
            })

            delete problem.solutionId

            return res.status(200).json({status: "success", data: problem})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    getProblemByTitle: async (req, res) => {
        try {
            if (!req.params.title) return badRequestError(res, "missingField", "Problem title is required");

            const title = req.params.title.replace(/-/g, ' ').toLowerCase()

            const problem = await Problem.findOne({
                where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('title')), title),
                raw: true
            })

            if (problem == null) {
                return res.status(404).json({
                    errorCode: 404,
                    errorDescription: "No record found for " + req.params.title
                })
            }

            problem.solution = await Solution.findOne({
                where: {
                    id: problem.solutionId
                }
            })

            delete problem.solutionId

            return res.status(200).json({status: "success", data: problem})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    },
    addProblem: async (req, res) => {
        try {
            const body = req.body;
            if (!body.title) return badRequestError(res, "missingField", "Problem title is required");
            if (!body.description) return badRequestError(res, "missingField", "Problem description is required");
            if (!body.testCase) return badRequestError(res, "missingField", "Problem testCase is required");
            if (!body.testCaseOutput) return badRequestError(res, "missingField", "Problem testCaseOutput is required");
            if (!body.solutionId) return badRequestError(res, "missingField", "SolutionId is required");


            const problem = Problem.build({
                title: body.title,
                description: body.description,
                testCase: body.testCase,
                testCaseOutput: body.testCaseOutput,
                solutionId: body.solutionId
            })

            await problem.save()

            return res.status(200).json({status: "success", data: problem})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error: " + err);
        }
    }
}

module.exports = problemController