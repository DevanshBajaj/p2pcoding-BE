const {User} = require("../sequelize");
const bcryt = require("bcrypt");
const {getJWT} = require("../utils/jwt")
const {badRequestError, unauthorizedError, internalServerError} = require("../Helpers/errorHelper")

const userController = {
    signUpUser: async (req, res) => {
        try {
            const body = req.body;
            if (!body.username) return badRequestError(res, "missingField", "Username is required");
            if (!body.password) return badRequestError(res, "missingField", "Password is required");

            const user = await User.findOne({
                where: {
                    username: body.username
                }
            })

            if (user != null) {
                return badRequestError(res, "duplicateUsername", "Username is taken");
            }

            const saltRounds = 10;
            const hash = await bcryt.hash(body.password, saltRounds)
            await User.create({
                username: body.username,
                password: hash
            })

            return res.status(200).json({status: "success"})
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error : " + err);
        }
    },
    loginUser: async (req, res) => {
        try {
            const body = req.body;
            if (!body.username) return badRequestError(res, "missingField", "Username is required");
            if (!body.password) return badRequestError(res, "missingField", "Password is required");

            const user = await User.findOne({
                where: {
                    username: body.username
                }
            })

            console.log(user)

            if (user == null) {
                return unauthorizedError(res, "invalidUsername", "Wrong username");
            }

            const isCorrectPassword = await bcryt.compare(body.password, user.password)
            if (!isCorrectPassword) return unauthorizedError(res, "invalidPassword", "Wrong password");

            const token = getJWT({username: user.username, id: user.id})
            return res.json({status: "success", token});
        } catch (err) {
            return internalServerError(res, "internalServerError", "Unexpected error : " + err);
        }
    }
}

module.exports = userController;